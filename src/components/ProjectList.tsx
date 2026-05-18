"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Project = {
  id: string;
  title: string;
  description: string;
  image: string;
};

export default function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.log(error);
      return;
    }

    setProjects(data);
  };

  return (
    <div className="p-10 grid grid-cols-1 md:grid-cols-3 gap-6">
      {projects.map((project) => (
        <div
          key={project.id}
          className="bg-zinc-900 rounded-xl overflow-hidden shadow-lg"
        >
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-56 object-cover"
          />

          <div className="p-5">
            <h2 className="text-2xl font-bold text-white">
              {project.title}
            </h2>

            <p className="text-zinc-400 mt-2">
              {project.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}