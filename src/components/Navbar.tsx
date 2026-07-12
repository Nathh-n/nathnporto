"use client";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo (Kiri) - Menggunakan file logo-nathcdr.png */}
        <Link href="/" className="flex items-center">
          <Image 
            src="/logo-nathcdr.png" 
            alt="Logo NATH" 
            width={60} 
            height={40} 
            className="object-contain"
            priority 
          />
        </Link>

        {/* Menu (Tengah) */}
        <div className="hidden md:flex space-x-8 font-semibold text-gray-800">
          <Link href="/" className="hover:text-blue-600 transition">Home</Link>
          <Link href="#about" className="hover:text-blue-600 transition">About</Link>
          <Link href="/work" className="hover:text-blue-600 transition">Work</Link>
          <Link href="#contact" className="hover:text-blue-600 transition">Contact</Link>
        </div>

        {/* Tombol (Kanan) */}
        <Link 
          href="#contact" 
          className="bg-gradient-to-r from-[#2C4CAB] via-[#7EBAFF] to-[#62A8F9] border-[3px] border-[#2C4CAB] text-white font-bold py-2 px-6 rounded-full shadow-lg transition-all transform hover:-translate-y-1 hover:brightness-110 flex items-center gap-2"
        >
          Work Together
          {/* Icon Briefcase Solid sesuai dengan gambar referensi barumu */}
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/>
          </svg>
        </Link>
      </div>
    </nav>
  );
}