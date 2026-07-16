"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function DesignProjectsAdmin() {
  const [projects, setProjects] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  
  // State Loading & Fetching
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [uploadStep, setUploadStep] = useState<"idle" | "uploading_image" | "saving_data" | "success">("idle");
  
  // State Input Baru
  const [title, setTitle] = useState("");
  const [toolsUsed, setToolsUsed] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State untuk Drag & Drop
  const [isDragging, setIsDragging] = useState(false);

  // State untuk Modal Edit
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [editData, setEditData] = useState({
    id: 0,
    title: "",
    tools_used: "",
    description: "",
    category_id: "",
  });

  // State untuk Custom Toast Notification
  const [toast, setToast] = useState<{show: boolean, message: string, type: "success" | "error" | "info"}>({
    show: false, message: "", type: "info"
  });

  const showToast = (message: string, type: "success" | "error" | "info") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "info" }), 3000);
  };

  useEffect(() => {
    fetchCategories();
    fetchProjects();
  }, []);

  const fetchCategories = async () => {
    const { data, error } = await supabase.from("categories").select("*");
    if (!error && data) setCategories(data);
  };

  const fetchProjects = async () => {
    setIsFetching(true);
    const { data, error } = await supabase
      .from("design_projects")
      .select("*, categories(name)")
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
        
        // Trik: Memasukkan file yang di-drop ke dalam input native 
        // agar tulisan "No file chosen" berubah menjadi nama file
        if (fileInputRef.current) {
          fileInputRef.current.files = e.dataTransfer.files;
        }
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

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title || !categoryId) {
      return showToast("Gambar, judul, dan kategori wajib diisi!", "error");
    }

    setIsLoading(true);
    setUploadStep("uploading_image");
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `design-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("portofolio-assets")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      setUploadStep("saving_data");

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
          category_id: categoryId,
          is_featured: false 
        }]);

      if (insertError) throw insertError;

      setUploadStep("success");
      showToast("Karya desain berhasil diupload!", "success");
      
      setTitle("");
      setToolsUsed("");
      setDescription("");
      setCategoryId("");
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = ""; 
      
      fetchProjects(); 

    } catch (error: any) {
      console.error("Error upload:", error);
      showToast("Gagal mengupload: " + error.message, "error");
    } finally {
      setTimeout(() => {
        setIsLoading(false);
        setUploadStep("idle");
      }, 1500);
    }
  };

  const handleDelete = async (id: number, imageUrl: string) => {
    const confirmDelete = window.confirm("Yakin ingin menghapus karya ini?");
    if (!confirmDelete) return;

    try {
      showToast("Menghapus karya...", "info");
      const { error: deleteDbError } = await supabase.from("design_projects").delete().eq("id", id);
      if (deleteDbError) throw deleteDbError;

      if (imageUrl) {
        const filePath = imageUrl.split('/portofolio-assets/')[1];
        if (filePath) await supabase.storage.from("portofolio-assets").remove([filePath]);
      }

      setProjects(projects.filter((p) => p.id !== id));
      showToast("Karya berhasil dihapus!", "success");
    } catch (error: any) {
      showToast("Gagal menghapus gambar.", "error");
    }
  };

  const handleToggleFeature = async (id: number, currentStatus: boolean) => {
    if (!currentStatus) {
      const featuredCount = projects.filter((p) => p.is_featured).length;
      if (featuredCount >= 5) return showToast("Maksimal 5 desain untuk Preview!", "error");
    }

    try {
      const { error } = await supabase.from("design_projects").update({ is_featured: !currentStatus }).eq("id", id);
      if (error) throw error;
      setProjects(projects.map((p) => p.id === id ? { ...p, is_featured: !currentStatus } : p));
      showToast("Status preview diperbarui!", "success");
    } catch (error: any) {
      showToast("Gagal mengupdate status preview.", "error");
    }
  };

  const openEditModal = (project: any) => {
    setEditData({
      id: project.id,
      title: project.title || "",
      tools_used: project.tools_used || "",
      description: project.description || "",
      category_id: project.category_id || "",
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editData.title || !editData.category_id) return showToast("Judul dan Kategori tidak boleh kosong!", "error");

    setIsSavingEdit(true);
    try {
      const { error } = await supabase
        .from("design_projects")
        .update({
          title: editData.title,
          tools_used: editData.tools_used,
          description: editData.description,
          category_id: editData.category_id
        })
        .eq("id", editData.id);

      if (error) throw error;

      showToast("Data karya berhasil diperbarui!", "success");
      setIsEditModalOpen(false);
      fetchProjects(); 
    } catch (error: any) {
      showToast("Gagal menyimpan perubahan.", "error");
    } finally {
      setIsSavingEdit(false);
    }
  };

  const featuredCount = projects.filter((p) => p.is_featured).length;

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
                {uploadStep === "uploading_image" ? "Mengunggah Gambar..." : 
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

      
      {/* Header Info */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#283870] mb-2">Design Projects</h1>
          <p className="text-gray-500 font-medium">Kelola karya desainmu, atur kategori, dan pilih 5 terbaik untuk Preview.</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 px-6 py-3 rounded-2xl flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            {featuredCount === 5 ? (
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            ) : (
              <><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span></>
            )}
          </span>
          <p className="font-bold text-[#283870]">Preview Aktif: {featuredCount} / 5</p>
        </div>
      </div>

      {/* FORM UPLOAD BARU */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-12 relative overflow-hidden">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Upload Karya Baru</h2>
        <form onSubmit={handleUpload} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-600 mb-2">Judul Karya *</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Misal: Logo Startup" className="w-full bg-gray-50 border border-gray-200 text-gray-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#87BAF9] transition-all" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">Kategori *</label>
              <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full bg-gray-50 border border-gray-200 text-gray-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#87BAF9] transition-all appearance-none cursor-pointer">
                <option value="" disabled>-- Pilih Kategori --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">Software (Opsional)</label>
              <input type="text" value={toolsUsed} onChange={(e) => setToolsUsed(e.target.value)} placeholder="Misal: CorelDRAW" className="w-full bg-gray-50 border border-gray-200 text-gray-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#87BAF9] transition-all" />
            </div>

            {/* --- AREA FILE INPUT DENGAN DRAG & DROP --- */}
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">File Gambar *</label>
              <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative w-full rounded-xl transition-all duration-300 ${isDragging ? 'ring-2 ring-[#4882F0] bg-blue-50 scale-[1.01]' : ''}`}
              >
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  ref={fileInputRef} 
                  className={`w-full bg-gray-50 border border-gray-200 text-gray-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#87BAF9] transition-all cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-[#4882F0] hover:file:bg-blue-100 ${isDragging ? 'border-[#4882F0] bg-blue-50' : ''}`} 
                />
              </div>
            </div>

          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">Deskripsi (Opsional)</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} placeholder="Ceritakan detail proyek ini..." className="w-full bg-gray-50 border border-gray-200 text-gray-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#87BAF9] transition-all resize-none"></textarea>
          </div>
          
          <div className="flex justify-end mt-2">
            <button type="submit" disabled={isLoading} className="bg-[#4882F0] hover:bg-[#3267CC] text-white font-bold py-3 px-10 rounded-xl transition-all shadow-md disabled:opacity-50">
              Upload Karya
            </button>
          </div>
        </form>
      </div>

      {/* GALERI KARYA */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-6">Semua Karya ({projects.length})</h2>
        {isFetching ? (
          <div className="text-center py-10 text-gray-500 font-medium animate-pulse">Memuat data...</div>
        ) : projects.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-2xl border border-gray-100 text-gray-500 font-medium">Belum ada karya desain yang diupload.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div key={project.id} className={`bg-white rounded-3xl shadow-sm overflow-hidden group hover:shadow-lg transition-all flex flex-col border-2 ${project.is_featured ? "border-[#4882F0]" : "border-transparent"}`}>
                
                {/* Area Gambar */}
                <div className="relative w-full h-56 bg-gray-100 overflow-hidden">
                  {project.is_featured && (
                    <div className="absolute top-3 left-3 z-20 bg-[#4882F0] text-white text-[10px] font-extrabold px-3 py-1.5 rounded-lg shadow-md flex items-center gap-1">
                      ⭐ TAMPIL DI HOMEPAGE
                    </div>
                  )}
                  {project.categories && (
                    <div className="absolute bottom-3 left-3 z-20 bg-gray-900/80 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1 rounded-full">
                      📁 {project.categories.name}
                    </div>
                  )}

                  {project.image_url ? (
                    <Image src={project.image_url} alt={project.title || "Thumbnail"} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                  ) : (
                     <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                  )}
                  
                  {/* Overlay Tombol Aksi */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 backdrop-blur-[2px] z-10">
                    <button onClick={() => handleToggleFeature(project.id, project.is_featured)} className={`w-3/4 font-bold py-2 px-4 rounded-xl text-sm transition-all shadow-lg ${project.is_featured ? "bg-orange-500 hover:bg-orange-600 text-white" : "bg-blue-500 hover:bg-blue-600 text-white"}`}>
                      {project.is_featured ? "Hapus Preview" : "Jadikan Preview"}
                    </button>
                    <button onClick={() => openEditModal(project)} className="w-3/4 bg-slate-600 hover:bg-slate-700 text-white text-sm font-bold py-2 px-4 rounded-xl transition-all shadow-lg">
                      Edit Detail
                    </button>
                    <button onClick={() => handleDelete(project.id, project.image_url)} className="w-3/4 bg-red-500 hover:bg-red-600 text-white text-sm font-bold py-2 px-4 rounded-xl transition-all shadow-lg">
                      Hapus
                    </button>
                  </div>
                </div>

                {/* Area Teks Detail */}
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-extrabold text-gray-800 text-lg mb-1">{project.title || "Tanpa Judul"}</h3>
                  {project.tools_used && (
                    <span className="inline-block bg-blue-50 text-[#4882F0] text-xs font-bold px-3 py-1 rounded-full mb-3 self-start">
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

      {/* MODAL EDIT (POP UP) */}
      <AnimatePresence>
        {isEditModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-2xl p-8 shadow-2xl relative"
            >
              <button onClick={() => setIsEditModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-red-500 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
              
              <h2 className="text-2xl font-extrabold text-[#283870] mb-6">Edit Detail Karya</h2>
              
              <form onSubmit={handleSaveEdit} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">Judul Karya</label>
                    <input type="text" value={editData.title} onChange={(e) => setEditData({...editData, title: e.target.value})} className="w-full bg-gray-50 border border-gray-200 text-gray-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#87BAF9] transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">Kategori</label>
                    <select value={editData.category_id} onChange={(e) => setEditData({...editData, category_id: e.target.value})} className="w-full bg-gray-50 border border-gray-200 text-gray-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#87BAF9] transition-all cursor-pointer">
                      <option value="" disabled>-- Pilih Kategori --</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">Software</label>
                  <input type="text" value={editData.tools_used} onChange={(e) => setEditData({...editData, tools_used: e.target.value})} className="w-full bg-gray-50 border border-gray-200 text-gray-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#87BAF9] transition-all" />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">Deskripsi</label>
                  <textarea value={editData.description} onChange={(e) => setEditData({...editData, description: e.target.value})} rows={3} className="w-full bg-gray-50 border border-gray-200 text-gray-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#87BAF9] transition-all resize-none"></textarea>
                </div>

                <div className="flex justify-end gap-3 mt-4">
                  <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-6 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors">Batal</button>
                  <button type="submit" disabled={isSavingEdit} className="bg-[#4882F0] hover:bg-[#3267CC] text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md disabled:opacity-50 flex items-center gap-2">
                    {isSavingEdit ? (
                      <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Menyimpan...</>
                    ) : "Simpan Perubahan"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}