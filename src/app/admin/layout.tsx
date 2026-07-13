"use client";
import SidebarAdmin from "@/components/SidebarAdmin"; 
import "../globals.css";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  // Cek apakah user sedang berada di halaman login
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      
      // Jika TIDAK ADA session (belum login) dan mencoba masuk halaman selain login -> Tendang ke Login
      if (!data.session && !isLoginPage) {
        // Gunakan replace agar user tidak bisa klik tombol "Back" ke dashboard
        router.replace("/admin/login"); 
        // JANGAN setIsChecking(false) di sini. Biarkan tetap true (loading) 
        // sampai halamannya benar-benar pindah ke /admin/login.
      } 
      // Jika SUDAH ADA session (sudah login) dan mencoba masuk halaman login -> Arahkan ke Dashboard
      else if (data.session && isLoginPage) {
        router.replace("/admin/coding-projects"); // Sesuaikan jika halaman utamanya berbeda
        // JANGAN setIsChecking(false) di sini.
      }
      // Jika posisinya SUDAH BENAR (Sudah login di admin, ATAU belum login di halaman login)
      else {
        // BARU matikan loadingnya agar konten dirender
        setIsChecking(false);
      }
    };

    checkUser();
  }, [pathname, router, isLoginPage]);

  // Layar loading sementara saat mengecek keamanan
  if (isChecking) {
    return (
      <html lang="id">
        <body className="flex h-screen items-center justify-center bg-[#F4F7FE]">
          {/* Animasi loading yang lebih elegan */}
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#3B5BDB]"></div>
            <div className="animate-pulse text-lg font-bold text-[#3B5BDB]">Memverifikasi Sesi...</div>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="id">
      <body>
        {/* Jika di halaman login, JANGAN tampilkan Sidebar */}
        {isLoginPage ? (
          children
        ) : (
          <div className="flex h-screen bg-[#F4F7FE] overflow-hidden">
            <SidebarAdmin />
            <main className="flex-1 h-full overflow-y-auto p-8 relative">
              {children}
            </main>
          </div>
        )}
      </body>
    </html>
  );
}