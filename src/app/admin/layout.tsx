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
        router.push("/admin/login");
      } 
      // Jika SUDAH ADA session (sudah login) dan mencoba masuk halaman login -> Arahkan ke Dashboard
      else if (data.session && isLoginPage) {
        router.push("/admin");
      }
      
      setIsChecking(false);
    };

    checkUser();
  }, [pathname, router, isLoginPage]);

  // Layar loading sementara saat mengecek keamanan
  if (isChecking) {
    return (
      <html lang="en">
        <body className="flex h-screen items-center justify-center bg-[#F4F7FE]">
          <div className="animate-pulse text-xl font-bold text-blue-500">Memverifikasi Keamanan...</div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
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