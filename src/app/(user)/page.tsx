"use client";

import { useState } from "react";
import Link from "next/link";
import ProjectList from "@/components/ProjectList";

export default function HomePage() {
  // State form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState("Jasa Desain Grafis");
  const [message, setMessage] = useState("");

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Halo ${name}! Permintaan order untuk layanan "${service}" telah diterima.`);
    setName("");
    setEmail("");
    setService("Jasa Desain Grafis");
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
          2. ABOUT ME & SKILLS 
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
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm text-3xl mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform">🎨</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Graphic & UI Design</h3>
              <p className="text-slate-600 text-base leading-relaxed mb-8 flex-grow">
                Merancang identitas visual, aset digital, dan tata letak yang menarik serta komunikatif.
              </p>
              <div className="flex flex-wrap gap-2 mt-auto">
                <span className="px-3 py-1.5 bg-white text-slate-700 text-sm font-bold rounded-lg border border-slate-200 shadow-sm">CorelDRAW</span>
                <span className="px-3 py-1.5 bg-white text-slate-700 text-sm font-bold rounded-lg border border-slate-200 shadow-sm">UI Design</span>
              </div>
            </div>

            <div className="p-8 md:p-10 rounded-[2rem] bg-blue-50 border border-blue-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group flex flex-col">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm text-3xl text-blue-600 mb-6 group-hover:scale-110 group-hover:-rotate-6 transition-transform">💻</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Web Development</h3>
              <p className="text-slate-600 text-base leading-relaxed mb-8 flex-grow">
                Membangun aplikasi web full-stack modern dengan performa tinggi dan dinamis.
              </p>
              <div className="flex flex-wrap gap-2 mt-auto">
                <span className="px-3 py-1.5 bg-white text-blue-700 text-sm font-bold rounded-lg border border-blue-200 shadow-sm">Laravel & Next.js</span>
                <span className="px-3 py-1.5 bg-white text-blue-700 text-sm font-bold rounded-lg border border-blue-200 shadow-sm">Supabase</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          3. PROJECTS GALLERY
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
          4. FORM ORDER SECTION (REDESIGN)
      ========================================= */}
      <section id="contact" className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Bagian Kiri: Teks & Info Kontak (Bentuk Card) */}
          <div className="flex flex-col h-full justify-center">
            <span className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-4 block">
              Let's Work Together
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-6">
              Punya ide menarik? <br />
              Mari kita diskusikan.
            </h2>
            <p className="text-lg text-slate-600 mb-10 leading-relaxed max-w-lg">
              Saya selalu terbuka untuk mendiskusikan proyek desain grafis, pengembangan website, atau kolaborasi kreatif lainnya. Silakan isi form, dan saya akan merespon secepatnya.
            </p>

            {/* Info Kontak dengan desain Card Mini dan Icon SVG */}
            <div className="space-y-4">
              {/* Card Email */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-center gap-5 w-full max-w-md hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-blue-600 shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Email Me</p>
                  <p className="text-slate-900 font-bold">hello@portofolio.com</p>
                </div>
              </div>
              
              {/* Card Location */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-center gap-5 w-full max-w-md hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-blue-600 shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Location</p>
                  <p className="text-slate-900 font-bold">Indonesia</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bagian Kanan: Form Card (Redesain agar lebih Luwes) */}
          <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <h3 className="text-2xl font-bold text-slate-900 mb-8">Kirim Permintaan Order</h3>
            
            <form onSubmit={handleOrderSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2.5">
                  <label className="text-sm font-semibold text-slate-700">Nama Lengkap</label>
                  <input 
                    type="text" 
                    required
                    placeholder="John Doe"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-700 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all text-sm font-medium"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2.5">
                  <label className="text-sm font-semibold text-slate-700">Alamat Email</label>
                  <input 
                    type="email" 
                    required
                    placeholder="email@contoh.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-700 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all text-sm font-medium"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                <label className="text-sm font-semibold text-slate-700">Layanan yang Diinginkan</label>
                {/* Pilihan Statis Jasa Desain & Coding */}
                <select 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-700 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all text-sm font-semibold cursor-pointer appearance-none"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                >
                  <option value="Jasa Desain Grafis">Jasa Desain Grafis</option>
                  <option value="Jasa Pembuatan Website / Coding">Jasa Pembuatan Website / Coding</option>
                </select>
              </div>

              <div className="space-y-2.5">
                <label className="text-sm font-semibold text-slate-700">Detail Singkat Project</label>
                <textarea 
                  required
                  rows={4}
                  placeholder="Ceritakan detail proyek yang ingin Anda buat..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-700 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all text-sm font-medium resize-none"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                ></textarea>
              </div>

              <button 
                type="submit"
                className="w-full bg-blue-600 text-white font-bold text-sm rounded-2xl py-4 mt-4 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/20 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
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