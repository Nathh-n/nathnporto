"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Project = {
  id: string;
  title: string;
  description: string;
  image: string;
  categories: { name: string } | null;
};

export default function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from("projects")
      .select("*, categories(name)")
      .order("created_at", { ascending: false });

    if (error) {
      console.log(error);
      return;
    }

    const fetchedProjects = data as Project[];
    setProjects(fetchedProjects);

    // Otomatis mengambil daftar kategori unik dari project yang diupload
    const uniqueCategories = Array.from(
      new Set(fetchedProjects.map((p) => p.categories?.name).filter(Boolean))
    ) as string[];

    setCategories(uniqueCategories);
  };

  // Fungsi untuk memfilter project berdasarkan tombol yang diklik
  const filteredProjects = activeFilter === "All"
    ? projects
    : projects.filter((p) => p.categories?.name === activeFilter);

  return (
    <div>
      {/* =========================================
          TOMBOL FILTER KATEGORI
      ========================================= */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        <button
          onClick={() => setActiveFilter("All")}
          className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
            activeFilter === "All"
              ? "bg-blue-600 text-white shadow-md scale-105"
              : "bg-white text-slate-600 border border-slate-200 hover:border-blue-600 hover:text-blue-600"
          }`}
        >
          All Works
        </button>
        
        {/* Render tombol otomatis dari database */}
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all uppercase tracking-wider ${
              activeFilter === cat
                ? "bg-blue-600 text-white shadow-md scale-105"
                : "bg-white text-slate-600 border border-slate-200 hover:border-blue-600 hover:text-blue-600"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* =========================================
          GRID GALERI PROJECT
      ========================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group flex flex-col"
          >
            {/* Bagian Gambar */}
            <div className="relative h-60 w-full overflow-hidden bg-slate-100">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Bagian Teks */}
            <div className="p-6 flex flex-col flex-grow">
              {project.categories?.name && (
                <span className="inline-block mb-4 text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full uppercase tracking-wider w-fit">
                  {project.categories.name}
                </span>
              )}
              
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {project.title}
              </h3>

              <p className="text-slate-600 text-sm leading-relaxed mb-4 flex-grow line-clamp-3">
                {project.description}
              </p>
            </div>
          </div>
        ))}
        
        {/* Pesan jika project di kategori tersebut kosong */}
        {filteredProjects.length === 0 && (
          <div className="col-span-full text-center py-10 text-slate-500 font-medium">
            Belum ada karya di kategori ini.
          </div>
        )}
      </div>
    </div>
  );
}