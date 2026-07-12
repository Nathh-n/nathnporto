"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase"; 
import { useRouter } from "next/navigation";

export default function SidebarAdmin() {
  const pathname = usePathname();

  // Daftar menu admin
  const menuItems = [
    { name: "Dashboard", path: "/admin" },
    { name: "Design Projects", path: "/admin/design-projects" },
    { name: "Coding Projects", path: "/admin/coding-projects" },
    { name: "Tools & Skills", path: "/admin/tools" },
  ];

  return (
    <aside className="w-64 h-screen bg-[#283870] text-white flex flex-col shadow-2xl sticky top-0">
      
      {/* Header / Logo Admin */}
      <div className="h-20 flex items-center justify-center border-b border-white/10">
        <h1 className="text-2xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#87BAF9] to-white">
          ADMIN.PANEL
        </h1>
      </div>

      {/* Menu Navigasi */}
      <nav className="flex-1 py-8 flex flex-col gap-2 px-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link 
              key={item.name} 
              href={item.path}
              className={`px-4 py-3 rounded-xl font-bold transition-all duration-300 flex items-center gap-3 ${
                isActive 
                  ? "bg-gradient-to-r from-[#62A8F9] to-[#87BAF9] shadow-lg translate-x-1" 
                  : "hover:bg-white/10 hover:translate-x-1 text-gray-300 hover:text-white"
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Tombol Logout / Keluar */}
      <div className="p-4 border-t border-white/10">
        <button 
          onClick={async () => {
            await supabase.auth.signOut();
            window.location.href = "/";
          }}
          className="flex items-center justify-center w-full px-4 py-3 bg-red-500/20 text-red-300 hover:bg-red-500 hover:text-white rounded-xl font-bold transition-all"
        >
          Logout & Back
        </button>
      </div>

    </aside>
  );
}