"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";

export default function DesignDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // State untuk fitur Zoom/Lightbox
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    const fetchProjectDetail = async () => {
      const projectId = params.id;
      if (projectId) {
        const { data } = await supabase
          .from("design_projects")
          .select("*")
          .eq("id", projectId)
          .single();

        if (data) setProject(data);
      }
      setIsLoading(false);
    };

    fetchProjectDetail();
  }, [params.id]);

  // Fungsi kontrol Zoom
  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.5, 4)); // Maksimal zoom 4x
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.5, 0.5)); // Minimal zoom 0.5x
  const handleCloseZoom = () => {
    setIsZoomOpen(false);
    setTimeout(() => setZoomLevel(1), 300); // Reset zoom setelah animasi tutup selesai
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F4F7FE] flex flex-col items-center justify-center text-[#283870] gap-4">
        <div className="w-12 h-12 border-4 border-[#E1EAFB] border-t-[#283870] rounded-full animate-spin"></div>
        <p className="font-bold animate-pulse">Menyiapkan kanvas...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#F4F7FE] flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Karya tidak ditemukan</h1>
        <button onClick={() => router.back()} className="text-blue-500 font-bold hover:underline">← Kembali</button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F4F7FE] pt-24 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Tombol Back */}
        <button 
          onClick={() => router.back()} 
          className="group flex items-center gap-2 text-gray-500 hover:text-[#4882F0] font-bold transition-colors mb-8"
        >
          <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:shadow-md transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          </div>
          Kembali ke Galeri
        </button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          /* CONTAINER UTAMA: Berbaris ke bawah di HP (flex-col), Berbaris ke samping di Desktop (md:flex-row) */
          className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100 relative z-10 flex flex-col md:flex-row min-h-[60vh]"
        >
          
          {/* AREA KIRI: Gambar (Di atas kalau di HP) */}
          <div 
            className="w-full md:w-[55%] lg:w-[60%] bg-gray-50 p-6 md:p-10 flex flex-col items-center justify-center relative group cursor-zoom-in border-b md:border-b-0 md:border-r border-gray-100" 
            onClick={() => setIsZoomOpen(true)}
          >
            {project.image_url ? (
              <>
                <Image 
                  src={project.image_url} 
                  alt={project.title || "Design Detail"} 
                  width={1200}
                  height={1200}
                  className="w-auto h-auto max-h-[50vh] md:max-h-[75vh] object-contain shadow-lg rounded-xl transition-transform duration-300 group-hover:scale-[1.02]"
                  priority 
                />
                {/* Petunjuk hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
                  <span className="bg-white/90 backdrop-blur text-gray-800 px-4 py-2 rounded-full text-sm font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-4 group-hover:translate-y-0">
                    Klik untuk memperbesar
                  </span>
                </div>
              </>
            ) : (
              <div className="text-gray-400">Tidak ada gambar untuk ditampilkan.</div>
            )}
          </div>

          {/* AREA KANAN: Detail Informasi (Di bawah kalau di HP) */}
          <div className="w-full md:w-[45%] lg:w-[40%] p-8 md:p-12 flex flex-col">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#283870] mb-6">{project.title || "Tanpa Judul"}</h1>
            
            <div className="flex flex-col items-start gap-4 mb-8">
              {project.tools_used && (
                <span className="bg-[#E1EAFB] text-[#283870] text-sm font-bold px-4 py-2.5 rounded-full flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  {project.tools_used}
                </span>
              )}
              {project.is_featured && (
                <span className="bg-orange-50 text-orange-500 text-sm font-bold px-4 py-2.5 rounded-full border border-orange-200 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
                  Featured Highlight
                </span>
              )}
            </div>

            <div className="w-12 h-1.5 bg-[#4882F0] rounded-full mb-8"></div>
            
            <div className="prose prose-blue max-w-none">
              <p className="text-gray-600 text-lg leading-relaxed font-medium">
                {project.description || "Tidak ada deskripsi detail untuk karya ini."}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* OVERLAY MODAL ZOOM (Tetap sama, tidak ada perubahan logika) */}
      <AnimatePresence>
        {isZoomOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center"
          >
            {/* Navigasi Zoom */}
            <div className="absolute top-6 right-6 flex items-center gap-4 z-50 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
              <button onClick={handleZoomOut} className="text-white hover:text-blue-400 p-2 transition-colors" title="Zoom Out">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"></path></svg>
              </button>
              <span className="text-white font-bold text-sm w-12 text-center">{Math.round(zoomLevel * 100)}%</span>
              <button onClick={handleZoomIn} className="text-white hover:text-blue-400 p-2 transition-colors" title="Zoom In">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path></svg>
              </button>
              <div className="w-px h-6 bg-white/20 mx-2"></div>
              <button onClick={handleCloseZoom} className="text-white hover:text-red-400 p-2 transition-colors" title="Tutup">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            {/* Area Gambar yang di-zoom */}
            <div className="w-full h-full overflow-auto flex items-center justify-center p-4">
              <motion.div
                animate={{ scale: zoomLevel }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="relative cursor-grab active:cursor-grabbing origin-center"
              >
                <Image 
                  src={project.image_url} 
                  alt={project.title} 
                  width={2000}
                  height={2000}
                  className="max-w-none w-auto h-auto object-contain"
                  draggable={false} 
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}