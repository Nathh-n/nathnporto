"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function WorkPage() {
  const [activeTab, setActiveTab] = useState<"design" | "coding">("design");
  // State untuk menyimpan desain yang sudah dikelompokkan
  const [groupedDesigns, setGroupedDesigns] = useState<Record<string, any[]>>({});
  const [codingProjects, setCodingProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllWorks = async () => {
      setIsLoading(true);
      
      // 1. Tarik data Desain (Mengambil nama kategori dari relasi tabel categories)
      const { data: designs } = await supabase
        .from("design_projects")
        // Asumsi: relasi bernama categories, dan kita ambil kolom 'name'
        .select("*, categories(name)") 
        .order("created_at", { ascending: false });
      
      if (designs) {
        // Logika Pengelompokan (Grouping) berdasarkan kategori
        const grouped = designs.reduce((acc, curr) => {
          // Jika tidak ada kategori, masukkan ke "Lainnya"
          const categoryName = curr.categories?.name || "Lainnya";
          if (!acc[categoryName]) {
            acc[categoryName] = [];
          }
          acc[categoryName].push(curr);
          return acc;
        }, {} as Record<string, any[]>);
        
        setGroupedDesigns(grouped);
      }

      // 2. Tarik data Coding
      const { data: codes } = await supabase
        .from("coding_projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (codes) setCodingProjects(codes);

      setIsLoading(false);
    };

    fetchAllWorks();
  }, []);

  // Hitung total desain dari semua grup
  const totalDesignCount = Object.values(groupedDesigns).reduce((acc, curr) => acc + curr.length, 0);

  return (
    <main className="min-h-screen bg-[#F4F7FE] pb-24">
      
      {/* HEADER SECTION */}
      <section className="bg-gradient-to-b from-[#87BAF9] to-[#5C9DF2] pt-32 pb-20 px-6 text-center rounded-b-[3rem] shadow-sm relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-md">My Works</h1>
          <p className="text-blue-100 text-lg md:text-xl font-medium">
            Eksplorasi seluruh karya desain grafis dan proyek web development yang pernah saya kerjakan.
          </p>
        </div>
      </section>

      {/* TAB NAVIGATION */}
      <div className="max-w-xl mx-auto mt-[-30px] relative z-20 px-6">
        <div className="bg-white p-2 rounded-2xl shadow-lg flex gap-2">
          <button
            onClick={() => setActiveTab("design")}
            className={`flex-1 py-3 px-6 rounded-xl font-bold text-sm transition-all ${
              activeTab === "design" 
                ? "bg-[#4882F0] text-white shadow-md" 
                : "bg-transparent text-gray-500 hover:bg-gray-100"
            }`}
          >
            Design Gallery ({totalDesignCount})
          </button>
          <button
            onClick={() => setActiveTab("coding")}
            className={`flex-1 py-3 px-6 rounded-xl font-bold text-sm transition-all ${
              activeTab === "coding" 
                ? "bg-[#4882F0] text-white shadow-md" 
                : "bg-transparent text-gray-500 hover:bg-gray-100"
            }`}
          >
            Coding Projects ({codingProjects.length})
          </button>
        </div>
      </div>

      {/* CONTENT SECTION */}
      <section className="max-w-7xl mx-auto px-6 mt-16 min-h-[400px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-[#4882F0] gap-4">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-[#4882F0] rounded-full animate-spin"></div>
            <p className="font-bold animate-pulse">Menyusun mahakarya...</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            
            {/* --- TAB DESAIN (Dengan Kategori Horizontal Scroll) --- */}
            {activeTab === "design" && (
              <motion.div
                key="design"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-12"
              >
                {Object.keys(groupedDesigns).length === 0 ? (
                  <div className="text-center py-20 text-gray-400 font-medium">Belum ada karya desain.</div>
                ) : (
                  Object.entries(groupedDesigns).map(([category, projects]) => (
                    <div key={category} className="flex flex-col">
                      <h2 className="text-3xl font-extrabold text-[#283870] mb-6 pl-2 border-l-4 border-[#4882F0]">
                        {category}
                      </h2>
                      
                      {/* Container Horizontal Scroll */}
                      <div className="flex overflow-x-auto gap-6 pb-8 pt-2 snap-x snap-mandatory hide-scrollbar pr-6">
                        {projects.map((project) => (
                          <Link 
                            href={`/work/${project.id}`} 
                            key={project.id} 
                            // Ukuran lebar card dibuat tetap (min-w) agar bisa digeser
                            className="min-w-[280px] md:min-w-[320px] max-w-[320px] bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group border border-gray-100 cursor-pointer hover:-translate-y-2 snap-start"
                          >
                            <div className="relative w-full h-60 bg-gray-100 overflow-hidden rounded-t-3xl">
                              {project.image_url ? (
                                <Image 
                                  src={project.image_url} 
                                  alt={project.title || "Design"} 
                                  fill 
                                  className="object-cover group-hover:scale-110 transition-transform duration-700" 
                                  sizes="(max-width: 768px) 100vw, 320px"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                              )}
                              {project.is_featured && (
                                <div className="absolute top-3 left-3 z-10 bg-orange-500 text-white text-[10px] font-extrabold px-3 py-1.5 rounded-lg shadow-md">
                                  ⭐ HIGHLIGHT
                                </div>
                              )}
                            </div>
                            <div className="p-5 flex-1 flex flex-col">
                              <h3 className="font-extrabold text-gray-800 text-lg mb-2 group-hover:text-blue-600 transition-colors truncate">{project.title || "Tanpa Judul"}</h3>
                              {project.tools_used && (
                                <span className="inline-block bg-[#E1EAFB] text-[#283870] text-[10px] font-bold px-3 py-1.5 rounded-full mb-3 self-start">
                                  {project.tools_used}
                                </span>
                              )}
                              <p className="text-gray-500 text-sm font-medium line-clamp-2 mt-auto">
                                {project.description || "Tidak ada deskripsi."}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </motion.div>
            )}

            {/* --- TAB CODING (Tetap menggunakan Grid biasa) --- */}
            {activeTab === "coding" && (
              <motion.div
                key="coding"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {/* ... Kode mapping codingProjects tetap sama seperti sebelumnya ... */}
                {codingProjects.length === 0 ? (
                  <div className="col-span-full text-center py-20 text-gray-400 font-medium">Belum ada proyek coding.</div>
                ) : (
                  codingProjects.map((project) => (
                    <div key={project.id} className="bg-white rounded-[24px] p-5 flex flex-col shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
                      <div className="relative w-full h-48 bg-gray-200 rounded-xl mb-5 overflow-hidden group">
                        {project.image_url ? (
                          <Image 
                            src={project.image_url} 
                            alt={project.title} 
                            fill 
                            className="object-cover group-hover:scale-105 transition-transform duration-500" 
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                        )}
                      </div>
                      <h3 className="font-extrabold text-gray-800 text-xl mb-2">{project.title}</h3>
                      <p className="text-gray-500 text-sm font-medium mb-6 line-clamp-3">{project.description}</p>
                      <div className="flex justify-between items-end mt-auto pt-4 border-t border-gray-50">
                        <div className="flex flex-wrap gap-2">
                          {project.tags?.map((tag: string) => (
                            <span key={tag} className="text-[10px] font-bold bg-gray-50 text-gray-600 px-3 py-1 rounded-md border border-gray-200">{tag}</span>
                          ))}
                        </div>
                        <Link href={project.link || "#"} target="_blank" className="bg-[#4882F0] hover:bg-[#3267CC] text-white text-xs font-bold py-2.5 px-5 rounded-xl flex items-center gap-1.5 transition-colors whitespace-nowrap ml-2 shadow-md">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                          Demo
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </section>

      <div className="max-w-6xl mx-auto px-6 mt-16 text-center">
        <Link href="/" className="inline-block text-gray-400 hover:text-[#4882F0] font-bold transition-colors">
          ← Kembali ke Halaman Utama
        </Link>
      </div>
    </main>
  );
}