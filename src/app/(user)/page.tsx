"use client";

import { useState } from "react";
import Link from "next/link";
import ProjectList from "@/components/ProjectList";

export default function HomePage() {
  // State untuk menyimpan inputan form order customer
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState("Graphic Design");
  const [message, setMessage] = useState("");

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Logika pop-up sementara sebelum kita hubungkan ke tabel Supabase
    alert(`Halo ${name}! Permintaan order untuk proyek "${service}" telah diterima. Keterangan lengkap akan segera kami proses.`);
    
    // Reset form setelah sukses submit
    setName("");
    setEmail("");
    setService("Graphic Design");
    setMessage("");
  };

  return (
    <div className="bg-slate-50">
      
      {/* =========================================
          1. HERO SECTION 
      ========================================= */}
      <section className="min-h-[calc(100vh-6rem)] flex flex-col justify-center py-12 relative">
        <div className="max-w-6xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          
          <div className="flex flex-col items-start text-left order-2 lg:order-1">
            <span className="text-blue-600 font-semibold tracking-wider uppercase text-sm mb-4">
              Welcome to my creative space
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
              Menciptakan <span className="text-blue-600">Desain</span> & <br />
              Membangun <span className="text-blue-600">Sistem</span>.
            </h1>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-lg">
              Seorang Graphic Designer dan Full-Stack Web Developer. Dari merancang identitas visual yang presisi, hingga merakit fungsionalitas website, saya siap mewujudkan ide kreatif menjadi kenyataan.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="#projects" className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 hover:shadow-lg hover:-translate-y-1 transition-all">
                Lihat Portofolio
              </Link>
              <Link href="#contact" className="px-8 py-3 bg-white text-slate-700 border border-slate-300 font-semibold rounded-full hover:text-blue-600 hover:border-blue-600 hover:-translate-y-1 transition-all shadow-sm">
                Hubungi Saya
              </Link>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end order-1 lg:order-2">
            <div className="relative w-72 h-72 md:w-96 md:h-96">
              <div className="absolute inset-0 bg-blue-200 rounded-full blur-3xl opacity-60 transform translate-x-4 translate-y-4"></div>
              <div className="relative w-full h-full bg-white rounded-[2rem] border-8 border-white shadow-xl overflow-hidden rotate-3 hover:rotate-0 transition-transform duration-500 flex items-center justify-center text-slate-400 font-medium">
                [ Tempat Foto Kamu ]
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg border border-slate-100 flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-bold text-slate-800">Available for Work</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          2. ABOUT ME & SKILLS (2 KARTU BERDAMPINGAN) 
      ========================================= */}
      <section id="about" className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-6">
          
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-6 block">
              Behind the Code & Canvas
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight mb-8">
              Mahasiswa tingkat akhir yang menggabungkan <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">estetika desain</span> dengan <span className="underline decoration-blue-200 decoration-4 underline-offset-8">logika sistem</span>.
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Saya sangat menikmati proses memecahkan masalah kompleks—mulai dari merancang antarmuka visual yang intuitif menggunakan CorelDRAW, hingga membangun arsitektur website yang dinamis dan kokoh.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            
            <div className="p-8 md:p-10 rounded-[2rem] bg-slate-50 border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group flex flex-col">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm text-3xl mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                🎨
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Graphic & UI Design</h3>
              <p className="text-slate-600 text-base leading-relaxed mb-8 flex-grow">
                Merancang identitas visual, aset digital, dan tata letak yang menarik serta komunikatif untuk berbagai kebutuhan media.
              </p>
              <div className="flex flex-wrap gap-2 mt-auto">
                <span className="px-3 py-1.5 bg-white text-slate-700 text-sm font-bold rounded-lg border border-slate-200 shadow-sm">CorelDRAW</span>
                <span className="px-3 py-1.5 bg-white text-slate-700 text-sm font-bold rounded-lg border border-slate-200 shadow-sm">Layouting</span>
                <span className="px-3 py-1.5 bg-white text-slate-700 text-sm font-bold rounded-lg border border-slate-200 shadow-sm">UI Design</span>
              </div>
            </div>

            <div className="p-8 md:p-10 rounded-[2rem] bg-blue-50 border border-blue-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group flex flex-col">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm text-3xl text-blue-600 mb-6 group-hover:scale-110 group-hover:-rotate-6 transition-transform">
                💻
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Web Development</h3>
              <p className="text-slate-600 text-base leading-relaxed mb-8 flex-grow">
                Membangun aplikasi web full-stack modern dengan performa tinggi, interaktif, dan terintegrasi dengan database.
              </p>
              <div className="flex flex-wrap gap-2 mt-auto">
                <span className="px-3 py-1.5 bg-white text-blue-700 text-sm font-bold rounded-lg border border-blue-200 shadow-sm">Laravel & Livewire</span>
                <span className="px-3 py-1.5 bg-white text-blue-700 text-sm font-bold rounded-lg border border-blue-200 shadow-sm">Next.js</span>
                <span className="px-3 py-1.5 bg-white text-blue-700 text-sm font-bold rounded-lg border border-blue-200 shadow-sm">Supabase</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================
          3. PROJECTS GALLERY (DENGAN FILTER KATEGORI)
      ========================================= */}
      <section id="projects" className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-6">
          
          <div className="text-center mb-16">
            <span className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-4 block">
              My Portfolio
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6">
              Karya Terbaru Saya
            </h2>
          </div>
          
          <ProjectList />

        </div>
      </section>

      {/* =========================================
          4. FORM ORDER SECTION (BARU)
      ========================================= */}
      <section id="contact" className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-6">
          
          <div className="text-center mb-12">
            <span className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-4 block">
              Get In Touch
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
              Mulai Project Anda
            </h2>
            <p className="text-slate-600 max-w-md mx-auto text-sm md:text-base">
              Punya ide luar biasa untuk desain grafis atau sistem web? Isi formulir di bawah ini untuk mengajukan order penawaran proyek.
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-slate-50 p-8 md:p-10 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/30">
            <form onSubmit={handleOrderSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Nama Lengkap</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Masukkan nama Anda"
                    className="w-full bg-white border border-slate-200 rounded-xl p-4 text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-sm font-medium shadow-sm"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Alamat Email</label>
                  <input 
                    type="email" 
                    required
                    placeholder="email@contoh.com"
                    className="w-full bg-white border border-slate-200 rounded-xl p-4 text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-sm font-medium shadow-sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Layanan yang Diinginkan</label>
                <select 
                  className="w-full bg-white border border-slate-200 rounded-xl p-4 text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-sm font-bold text-slate-600 shadow-sm cursor-pointer"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                >
                  <option value="Graphic Design">Graphic & UI Design (CorelDRAW)</option>
                  <option value="Web Development">Web Development (Laravel / Next.js)</option>
                  <option value="Full Package">Desain + Web Coding (Paket Lengkap)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Detail Singkat Project</label>
                <textarea 
                  required
                  rows={4}
                  placeholder="Ceritakan detail kebutuhan visual desain atau fitur web sistem yang ingin Anda buat..."
                  className="w-full bg-white border border-slate-200 rounded-xl p-4 text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-sm font-medium resize-none shadow-sm"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                ></textarea>
              </div>

              <button 
                type="submit"
                className="w-full bg-blue-600 text-white font-bold text-sm rounded-xl py-4 hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
              >
                Kirim Permintaan Order
              </button>

            </form>
          </div>

        </div>
      </section>

    </div>
  );
}