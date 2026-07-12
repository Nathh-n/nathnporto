"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) throw error;

      alert("Login Berhasil! Selamat datang Komandan.");
      router.push("/admin"); // Arahkan ke dashboard admin
    } catch (error: any) {
      alert("Login Gagal: Email atau Password salah.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#87BAF9] to-[#5C9DF2]">
      <div className="bg-white p-10 rounded-[32px] shadow-2xl w-full max-w-md relative overflow-hidden">
        
        {/* Dekorasi Estetik */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-100 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-100 rounded-full blur-2xl"></div>

        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold text-[#283870] mb-2 text-center">ADMIN.PANEL</h1>
          <p className="text-gray-500 font-medium text-center mb-8">Silakan login untuk mengelola portofolio.</p>

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="akun admin"
                required
                className="w-full bg-gray-50 border border-gray-200 text-gray-700 rounded-xl p-4 outline-none focus:ring-2 focus:ring-[#87BAF9] transition-all"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-gray-50 border border-gray-200 text-gray-700 rounded-xl p-4 outline-none focus:ring-2 focus:ring-[#87BAF9] transition-all"
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="mt-4 w-full bg-[#4882F0] hover:bg-[#3267CC] text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg disabled:opacity-50"
            >
              {isLoading ? "Memverifikasi..." : "Masuk ke Dashboard"}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <a href="/" className="text-sm font-bold text-gray-400 hover:text-blue-500 transition-colors">
              ← Kembali ke Website Utama
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}