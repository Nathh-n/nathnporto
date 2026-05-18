"use client";

import { useState } from "react";
// Import supabase jika nanti form ini mau langsung disimpan ke database
// import { supabase } from "@/lib/supabase"; 

export default function OrderPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    service: "Graphic Design",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Nanti kita tambahkan logika Supabase di sini
    alert("Fitur kirim pesan sedang disiapkan! Data yang diisi: " + formData.name);
    
  };

  return (
    <div className="min-h-[calc(100vh-6rem)] bg-slate-50 py-16">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        
        {/* Bagian Kiri: Teks Informasi */}
        <div>
          <span className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-4 block">
            Let's Work Together
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-6">
            Punya ide proyek? <br />
            Mari kita wujudkan.
          </h1>
          <p className="text-lg text-slate-600 mb-8 leading-relaxed">
            Apakah Anda membutuhkan identitas visual yang segar untuk brand Anda, atau ingin membangun aplikasi web dari nol? Isi form di samping dan ceritakan detail kebutuhan Anda.
          </p>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-xl border border-slate-100">✉️</div>
              <div>
                <p className="text-sm font-bold text-slate-500">Email Me At</p>
                <p className="text-slate-900 font-semibold">emailkamu@gmail.com</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-xl border border-slate-100">📍</div>
              <div>
                <p className="text-sm font-bold text-slate-500">Location</p>
                <p className="text-slate-900 font-semibold">Indonesia</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bagian Kanan: Form Order */}
        <div className="bg-white p-8 md:p-10 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Kirim Pesan / Request Order</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Nama Lengkap</label>
              <input 
                type="text" 
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Email Address</label>
              <input 
                type="email" 
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Jenis Layanan</label>
              <select 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all font-medium"
                value={formData.service}
                onChange={(e) => setFormData({...formData, service: e.target.value})}
              >
                <option value="Graphic Design">Graphic & UI Design</option>
                <option value="Web Development">Web Development</option>
                <option value="IoT/Hardware">IoT Prototyping</option>
                <option value="Other">Lainnya</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Detail Pesanan / Pesan</label>
              <textarea 
                required
                rows={4}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
                placeholder="Ceritakan detail proyek atau pertanyaan Anda di sini..."
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
              ></textarea>
            </div>

            <button 
              type="submit"
              className="w-full bg-blue-600 text-white font-bold text-lg rounded-xl py-4 hover:bg-blue-700 hover:shadow-lg hover:-translate-y-1 transition-all"
            >
              Kirim Pesan
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}