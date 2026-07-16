"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function CodingProjectsAdmin() {
  const [projects, setProjects] = useState<any[]>([]);
  
  // State Loading & Fetching UX
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [uploadStep, setUploadStep] = useState<"idle" | "uploading_image" | "saving_data" | "success">("idle");
  
  // State Custom Toast Notification
  const [toast, setToast] = useState<{show: boolean, message: string, type: "success" | "error" | "info"}>({
    show: false, message: "", type: "info"
  });

  // State untuk Form Input
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState(""); 
  const [demoLink, setDemoLink] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State untuk fitur Drag & Drop
  const [isDragging, setIsDragging] = useState(false);

  // Fungsi pemanggil Notifikasi
  const showToast = (message: string, type: "success" | "error" | "info") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "info" }), 3000);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setIsFetching(true);
    const { data, error } = await supabase
      .from("coding_projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      showToast("Gagal mengambil data dari database", "error");
    } else {
      setProjects(data || []);
    }
    setIsFetching(false);
  };

  // --- LOGIKA DRAG AND DROP ---
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); 
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type.startsWith("image/")) {
        setFile(droppedFile);
      } else {
        showToast("Format file tidak didukung! Masukkan gambar.", "error");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  // --- LOGIKA UPLOAD DENGAN UX PROGRESS ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title || !description || !tags || !demoLink) {
      return showToast("Mohon isi semua data dan pilih gambar thumbnail!", "error");
    }

    setIsLoading(true);
    setUploadStep("uploading_image");

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `coding-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from("portofolio-assets")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      setUploadStep("saving_data");

      const { data: publicUrlData } = supabase.storage
        .from("portofolio-assets")
        .getPublicUrl(fileName);
      const imageUrl = publicUrlData.publicUrl;

      const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag !== "");

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

      setUploadStep("success");
      showToast("Project berhasil ditambahkan!", "success");
      
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
      showToast("Gagal menyimpan project: " + error.message, "error");
    } finally {
      setTimeout(() => {
        setIsLoading(false);
        setUploadStep("idle");
      }, 1500);
    }
  };

  // --- LOGIKA HAPUS DATA ---
  const handleDelete = async (id: number, imageUrl: string) => {
    if (!window.confirm("Yakin ingin menghapus project ini?")) return;

    try {
      showToast("Menghapus project...", "info");
      const { error: deleteDbError } = await supabase
        .from("coding_projects")
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
      showToast("Project berhasil dihapus!", "success");
    } catch (error: any) {
      console.error("Error delete:", error);
      showToast("Gagal menghapus project: " + error.message, "error");
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-12 relative min-h-screen">
      
      {/* --- CUSTOM TOAST NOTIFICATION --- */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-8 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-full shadow-2xl font-bold text-white flex items-center gap-3 ${
              toast.type === "success" ? "bg-green-500" : 
              toast.type === "error" ? "bg-red-500" : "bg-[#4882F0]"
            }`}
          >
            {toast.type === "success" && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
            {toast.type === "error" && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>}
            {toast.type === "info" && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- PROGRESS BAR MODAL SAAT UPLOAD --- */}
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center"
          >
            <div className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl text-center">
              <div className="mb-6 relative w-20 h-20 mx-auto">
                {uploadStep !== "success" ? (
                  <div className="w-full h-full border-4 border-blue-100 border-t-[#4882F0] rounded-full animate-spin"></div>
                ) : (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-full h-full bg-green-500 rounded-full flex items-center justify-center text-white">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                  </motion.div>
                )}
              </div>
              <h3 className="text-xl font-extrabold text-[#283870] mb-2">
                {uploadStep === "uploading_image" ? "Mengunggah Thumbnail..." : 
                 uploadStep === "saving_data" ? "Menyimpan ke Database..." : 
                 "Upload Selesai!"}
              </h3>
              
              <div className="w-full bg-gray-100 rounded-full h-3 mt-6 overflow-hidden">
                <motion.div 
                  className="h-full bg-[#4882F0] rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ 
                    width: uploadStep === "uploading_image" ? "40%" : 
                           uploadStep === "saving_data" ? "80%" : "100%" 
                  }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#283870] mb-2">Coding Projects</h1>
        <p className="text-gray-500 font-medium">Kelola portofolio aplikasi dan web development milikmu.</p>
      </div>

      {/* --- FORM INPUT BARU --- */}
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

          {/* --- DRAG AND DROP ZONE (Kompak/Kecil) --- */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">Thumbnail Project</label>
            
            <div 
              className={`w-full border-2 border-dashed rounded-xl py-5 px-4 text-center transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-2 
                ${isDragging ? 'border-[#4882F0] bg-[#E1EAFB] scale-[1.01]' : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400'}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                className="hidden"
              />

              {file ? (
                <div className="flex flex-col items-center text-center">
                  <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-1">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <p className="font-extrabold text-sm text-gray-800">{file.name}</p>
                  <p className="text-xs text-gray-500 mt-1">Klik atau Drag file baru untuk mengganti</p>
                </div>
              ) : (
                <div className="flex flex-col items-center text-gray-500 pointer-events-none">
                  <svg className={`w-8 h-8 mb-2 transition-colors ${isDragging ? 'text-[#4882F0]' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                  <p className="font-bold text-gray-700 text-sm">Tarik & Lepas Gambar di sini</p>
                  <p className="text-xs mt-1">atau klik untuk menelusuri file (JPG, PNG, WebP)</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <button 
              type="submit" 
              className="bg-[#4882F0] hover:bg-[#3267CC] text-white font-bold py-3 px-10 rounded-xl transition-all shadow-md active:scale-95"
            >
              Simpan Project
            </button>
          </div>
        </form>
      </div>

      {/* --- DAFTAR PROJECT --- */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-6">Daftar Project ({projects.length})</h2>
        {isFetching ? (
          <div className="text-center py-10 text-gray-500 font-medium animate-pulse">Memuat data...</div>
        ) : projects.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-2xl border border-gray-100 text-gray-500 font-medium">Belum ada project yang ditambahkan.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project) => (
              <div key={project.id} className="bg-white rounded-[24px] p-5 flex flex-col shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:-translate-y-1">
                <div className="relative w-full h-48 bg-gray-200 rounded-xl mb-5 overflow-hidden">
                  {project.image_url ? (
                    <Image src={project.image_url} alt={project.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                  )}
                </div>
                <h3 className="font-extrabold text-gray-800 text-xl mb-1 group-hover:text-[#4882F0] transition-colors">{project.title}</h3>
                <p className="text-gray-500 text-sm font-medium mb-4 line-clamp-2">{project.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.map((tag: string, index: number) => (
                    <span key={index} className="text-[11px] font-bold bg-blue-50 text-[#4882F0] px-3 py-1.5 rounded-md border border-blue-100">{tag}</span>
                  ))}
                </div>
                
                <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-[#4882F0] hover:text-[#3267CC] flex items-center gap-1">
                    Cek Demo <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                  </a>
                  <button 
                    onClick={() => handleDelete(project.id, project.image_url)}
                    className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white text-xs font-bold py-2.5 px-5 rounded-lg transition-colors"
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