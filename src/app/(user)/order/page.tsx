"use client";

import { useState } from "react";
// import { supabase } from "@/lib/supabase"; 

export default function OrderPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    service: "Jasa Desain Grafis", // Disesuaikan dengan opsi statis
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Nanti kita tambahkan logika Supabase di sini
    alert("Fitur kirim pesan sedang disiapkan! Data yang diisi: " + formData.name);
    
  };

  return (
    <div className="min-h-[calc(100vh-6rem)] bg-slate-50 py-12 md:py-20 flex items-center">
      <div className="max-w-6xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* Bagian Kiri: Teks & Info Kontak */}
        <div className="lg:col-span-5 flex flex-col h-full justify-center">
          <span className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-4 block">
            Let's Work Together
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-6">
            Punya ide proyek? <br />
            Mari kita wujudkan.
          </h1>
          <p className="text-lg text-slate-600 mb-10 leading-relaxed max-w-sm">
            Apakah Anda membutuhkan identitas visual yang segar untuk brand Anda, atau ingin membangun aplikasi web dari nol? Isi form di samping dan ceritakan detail kebutuhan Anda.
          </p>

          {/* Info Kontak Cards (Menggunakan SVG Icons) */}
          <div className="space-y-4 max-w-sm">
            {/* Card Email */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-0.5 font-medium">Email Me At</p>
                <p className="text-slate-900 font-bold text-base">nurfatahillah000@gmail.com</p>
              </div>
            </div>
            
            {/* Card Location */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-0.5 font-medium">Location</p>
                <p className="text-slate-900 font-bold text-base">Indonesia</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bagian Kanan: Form Order */}
        <div className="lg:col-span-7 bg-white p-8 md:p-10 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Kirim Pesan / Request Order</h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Nama Lengkap</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-white border border-slate-300 rounded-xl p-3.5 text-slate-700 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all text-sm"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Email Address</label>
                <input 
                  type="email" 
                  required
                  className="w-full bg-white border border-slate-300 rounded-xl p-3.5 text-slate-700 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all text-sm"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Jenis Layanan</label>
              <div className="relative">
                <select 
                  className="w-full bg-white border border-slate-300 rounded-xl p-3.5 text-slate-700 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all text-sm appearance-none cursor-pointer"
                  value={formData.service}
                  onChange={(e) => setFormData({...formData, service: e.target.value})}
                >
                  <option value="Jasa Desain Grafis">Jasa Desain Grafis</option>
                  <option value="Jasa Pembuatan Website / Coding">Jasa Pembuatan Website / Coding</option>
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-500">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Detail Pesanan / Pesan</label>
              <textarea 
                required
                rows={5}
                className="w-full bg-white border border-slate-300 rounded-xl p-3.5 text-slate-700 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all text-sm resize-none"
                placeholder="Ceritakan detail proyek atau pertanyaan Anda di sini..."
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
              ></textarea>
            </div>

            <button 
              type="submit"
              className="w-full bg-blue-600 text-white font-bold text-sm rounded-xl py-4 mt-2 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30 transition-all duration-300 flex justify-center items-center gap-2"
            >
              <span>Kirim Pesan</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}