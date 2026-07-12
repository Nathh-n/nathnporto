"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

export default function DesignProjectsAdmin() {
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  
  // State Input Baru
  const [title, setTitle] = useState("");
  const [toolsUsed, setToolsUsed] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setIsFetching(true);
    const { data, error } = await supabase
      .from("design_projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Gagal mengambil data:", error);
    } else {
      setProjects(data || []);
    }
    setIsFetching(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title) return alert("Pilih gambar dan isi judul karya minimal!");

    setIsLoading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `design-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("portofolio-assets")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("portofolio-assets")
        .getPublicUrl(filePath);

      const imageUrl = publicUrlData.publicUrl;

      const { error: insertError } = await supabase
        .from("design_projects")
        .insert([{ 
          image_url: imageUrl,
          title: title,
          tools_used: toolsUsed,
          description: description,
          is_featured: false // Default selalu false saat pertama upload
        }]);

      if (insertError) throw insertError;

      alert("Karya desain berhasil diupload!");
      
      setTitle("");
      setToolsUsed("");
      setDescription("");
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = ""; 
      
      fetchProjects(); 

    } catch (error: any) {
      console.error("Error upload:", error);
      alert("Gagal mengupload gambar: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number, imageUrl: string) => {
    const confirmDelete = window.confirm("Yakin ingin menghapus karya ini?");
    if (!confirmDelete) return;

    try {
      const { error: deleteDbError } = await supabase
        .from("design_projects")
        .delete()
        .eq("id", id);

      if (deleteDbError) throw deleteDbError;

      if (imageUrl) {
        const filePath = imageUrl.split('/portofolio-assets/')[1];
        if (filePath) {
          await supabase.storage.from("portofolio-assets").remove([filePath]);
        }
      }

      setProjects(projects.filter((p) => p.id !== id));
    } catch (error: any) {
      console.error("Error delete:", error);
      alert("Gagal menghapus gambar: " + error.message);
    }
  };

  // Fungsi Baru: Mengatur Status Preview (Featured)
  const handleToggleFeature = async (id: number, currentStatus: boolean) => {
    // Jika mau menjadikan preview (true), cek dulu jumlah yang sudah jadi preview
    if (!currentStatus) {
      const featuredCount = projects.filter((p) => p.is_featured).length;
      if (featuredCount >= 5) {
        return alert("Maksimal hanya 5 desain untuk Preview Homepage! Nonaktifkan yang lain terlebih dahulu.");
      }
    }

    try {
      const { error } = await supabase
        .from("design_projects")
        .update({ is_featured: !currentStatus })
        .eq("id", id);

      if (error) throw error;

      // Update state lokal agar UI langsung berubah tanpa reload
      setProjects(projects.map((p) => p.id === id ? { ...p, is_featured: !currentStatus } : p));
    } catch (error: any) {
      console.error("Error update feature:", error);
      alert("Gagal mengupdate status preview.");
    }
  };

  // Hitung jumlah yang aktif sebagai preview
  const featuredCount = projects.filter((p) => p.is_featured).length;

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#283870] mb-2">Design Projects</h1>
          <p className="text-gray-500 font-medium">Kelola semua karya desainmu dan pilih 5 terbaik untuk Preview Homepage.</p>
        </div>
        
        {/* Indikator Jumlah Preview */}
        <div className="bg-blue-50 border border-blue-200 px-6 py-3 rounded-2xl flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            {featuredCount === 5 ? (
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            ) : (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
              </>
            )}
          </span>
          <p className="font-bold text-[#283870]">Preview Aktif: {featuredCount} / 5</p>
        </div>
      </div>

      {/* Form Upload */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-12">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Upload Karya Baru</h2>
        <form onSubmit={handleUpload} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">Apa nama/judul desain ini?</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Misal: Poster Estetika Cyber / Y2K"
                className="w-full bg-gray-50 border border-gray-200 text-gray-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#87BAF9] transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">Software yang digunakan?</label>
              <input 
                type="text" 
                value={toolsUsed}
                onChange={(e) => setToolsUsed(e.target.value)}
                placeholder="Misal: CorelDRAW, Photoshop"
                className="w-full bg-gray-50 border border-gray-200 text-gray-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#87BAF9] transition-all"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">Deskripsi atau Konsep (Opsional)</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Ceritakan sedikit tentang proyek ini..."
              className="w-full bg-gray-50 border border-gray-200 text-gray-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#87BAF9] transition-all resize-none"
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">Pilih File Gambar (JPG, PNG)</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="w-full bg-gray-50 border border-gray-200 text-gray-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#87BAF9] transition-all cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          <div className="flex justify-end mt-2">
            <button 
              type="submit" 
              disabled={isLoading || !file}
              className="bg-[#4882F0] hover:bg-[#3267CC] text-white font-bold py-3 px-10 rounded-xl transition-all shadow-md disabled:opacity-50"
            >
              {isLoading ? "Mengupload..." : "Upload Karya"}
            </button>
          </div>
        </form>
      </div>

      {/* Galeri Gambar */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-6">Semua Karya ({projects.length})</h2>
        {isFetching ? (
          <div className="text-center py-10 text-gray-500 font-medium animate-pulse">Memuat data...</div>
        ) : projects.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-2xl border border-gray-100 text-gray-500 font-medium">Belum ada karya desain yang diupload.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div 
                key={project.id} 
                className={`bg-white rounded-3xl shadow-sm overflow-hidden group hover:shadow-lg transition-all flex flex-col border-2 ${
                  project.is_featured ? "border-[#4882F0]" : "border-transparent"
                }`}
              >
                
                {/* Area Gambar */}
                <div className="relative w-full h-56 bg-gray-100 overflow-hidden">
                  {/* Badge Preview */}
                  {project.is_featured && (
                    <div className="absolute top-3 left-3 z-20 bg-[#4882F0] text-white text-[10px] font-extrabold px-3 py-1.5 rounded-lg shadow-md flex items-center gap-1">
                      ⭐ TAMPIL DI HOMEPAGE
                    </div>
                  )}

                  {project.image_url ? (
                    <Image src={project.image_url} alt={project.title || "Thumbnail"} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                  ) : (
                     <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                  )}
                  
                  {/* Overlay Tombol Aksi */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 backdrop-blur-[2px] z-10">
                    <button 
                      onClick={() => handleToggleFeature(project.id, project.is_featured)}
                      className={`font-bold py-2 px-6 rounded-xl transform scale-95 group-hover:scale-100 transition-all shadow-lg ${
                        project.is_featured ? "bg-orange-500 hover:bg-orange-600 text-white" : "bg-blue-500 hover:bg-blue-600 text-white"
                      }`}
                    >
                      {project.is_featured ? "Hapus dari Preview" : "Jadikan Preview"}
                    </button>
                    <button 
                      onClick={() => handleDelete(project.id, project.image_url)}
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-xl transform scale-95 group-hover:scale-100 transition-all shadow-lg"
                    >
                      Hapus Karya
                    </button>
                  </div>
                </div>

                {/* Area Teks Detail */}
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-extrabold text-gray-800 text-lg mb-1">{project.title || "Tanpa Judul"}</h3>
                  {project.tools_used && (
                    <span className="inline-block bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-full mb-3 self-start">
                      {project.tools_used}
                    </span>
                  )}
                  <p className="text-gray-500 text-sm font-medium line-clamp-2">
                    {project.description || "Tidak ada deskripsi."}
                  </p>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}