"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

export default function CodingProjectsAdmin() {
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  // State untuk Form
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState(""); // Input: "Laravel, React, Tailwind"
  const [demoLink, setDemoLink] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setIsFetching(true);
    const { data, error } = await supabase
      .from("coding_projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) console.error("Error fetching:", error);
    else setProjects(data || []);
    setIsFetching(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title || !description || !tags || !demoLink) {
      return alert("Mohon isi semua data dan pilih gambar thumbnail!");
    }

    setIsLoading(true);
    try {
      // 1. Upload Gambar ke Bucket
      const fileExt = file.name.split('.').pop();
      const fileName = `coding-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from("portofolio-assets")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // 2. Dapatkan URL Public Gambar
      const { data: publicUrlData } = supabase.storage
        .from("portofolio-assets")
        .getPublicUrl(fileName);
      const imageUrl = publicUrlData.publicUrl;

      // 3. Ubah format string "Laravel, React" menjadi Array ["Laravel", "React"]
      const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag !== "");

      // 4. Simpan ke Database
      const { error: insertError } = await supabase
        .from("coding_projects")
        .insert([{ 
          title: title, 
          description: description, 
          tags: tagsArray, 
          link: demoLink,
          image_url: imageUrl
        }]);

      if (insertError) throw insertError;

      alert("Project berhasil ditambahkan!");
      
      // Reset Form
      setTitle("");
      setDescription("");
      setTags("");
      setDemoLink("");
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      
      fetchProjects();
    } catch (error: any) {
      console.error("Error upload:", error);
      alert("Gagal menyimpan project: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number, imageUrl: string) => {
    if (!window.confirm("Yakin ingin menghapus project ini?")) return;

    try {
      // 1. Hapus dari database
      const { error: deleteDbError } = await supabase
        .from("coding_projects")
        .delete()
        .eq("id", id);

      if (deleteDbError) throw deleteDbError;

      // 2. Hapus gambar fisik dari Storage
      if (imageUrl) {
        const filePath = imageUrl.split('/portofolio-assets/')[1];
        if (filePath) {
          await supabase.storage.from("portofolio-assets").remove([filePath]);
        }
      }

      setProjects(projects.filter((p) => p.id !== id));
      alert("Project berhasil dihapus!");
    } catch (error: any) {
      console.error("Error delete:", error);
      alert("Gagal menghapus project: " + error.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#283870] mb-2">Coding Projects</h1>
        <p className="text-gray-500 font-medium">Kelola portofolio aplikasi dan web development milikmu.</p>
      </div>

      {/* Form Input Baru */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-12">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Tambah Project Baru</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">Nama Project</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Misal: Aplikasi Manajemen IoT"
                className="w-full bg-gray-50 border border-gray-200 text-gray-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#87BAF9] transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">Link Demo / GitHub</label>
              <input 
                type="text" 
                value={demoLink}
                onChange={(e) => setDemoLink(e.target.value)}
                placeholder="https://..."
                className="w-full bg-gray-50 border border-gray-200 text-gray-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#87BAF9] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">Tech Stack (Pisahkan dengan koma)</label>
            <input 
              type="text" 
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Misal: Next.js, Tailwind, Supabase"
              className="w-full bg-gray-50 border border-gray-200 text-gray-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#87BAF9] transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">Deskripsi Singkat</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Jelaskan secara singkat fitur utama project ini..."
              className="w-full bg-gray-50 border border-gray-200 text-gray-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#87BAF9] transition-all resize-none"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">Thumbnail Project</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="w-full bg-gray-50 border border-gray-200 text-gray-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#87BAF9] transition-all cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          <div className="flex justify-end mt-4">
            <button 
              type="submit" 
              disabled={isLoading}
              className="bg-[#4882F0] hover:bg-[#3267CC] text-white font-bold py-3 px-10 rounded-xl transition-all shadow-md disabled:opacity-50"
            >
              {isLoading ? "Menyimpan..." : "Simpan Project"}
            </button>
          </div>
        </form>
      </div>

      {/* Daftar Project */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-6">Daftar Project ({projects.length})</h2>
        {isFetching ? (
          <div className="text-center py-10 text-gray-500 font-medium animate-pulse">Memuat data...</div>
        ) : projects.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-2xl border border-gray-100 text-gray-500 font-medium">Belum ada project yang ditambahkan.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project) => (
              <div key={project.id} className="bg-white rounded-[24px] p-5 flex flex-col shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100">
                <div className="relative w-full h-48 bg-gray-200 rounded-xl mb-5 overflow-hidden">
                  {project.image_url ? (
                    <Image src={project.image_url} alt={project.title} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                  )}
                </div>
                <h3 className="font-extrabold text-gray-800 text-xl mb-1">{project.title}</h3>
                <p className="text-gray-500 text-sm font-medium mb-4 line-clamp-2">{project.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.map((tag: string, index: number) => (
                    <span key={index} className="text-[11px] font-bold bg-blue-50 text-blue-600 px-3 py-1 rounded-full">{tag}</span>
                  ))}
                </div>
                
                <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-blue-500 hover:text-blue-700">
                    Test Link Demo ↗
                  </a>
                  <button 
                    onClick={() => handleDelete(project.id, project.image_url)}
                    className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white text-xs font-bold py-2 px-4 rounded-lg transition-colors"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}