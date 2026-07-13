"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  // Mencegah scroll pada body saat menu mobile terbuka
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo (Kiri) */}
        <Link href="/" className="flex items-center z-50" onClick={closeMenu}>
          <Image 
            src="/logo-nathcdr.png" 
            alt="Logo NATH" 
            width={60} 
            height={40} 
            className="object-contain"
            priority 
          />
        </Link>

        {/* Menu Desktop (Tengah) - Sembunyi di Mobile */}
        <div className="hidden md:flex space-x-8 font-semibold text-gray-800">
          <Link href="/" className="hover:text-blue-600 transition">Home</Link>
          <Link href="/#about" className="hover:text-blue-600 transition">About</Link>
          <Link href="/work" className="hover:text-blue-600 transition">Work</Link>
        </div>

        {/* Tombol Work Together Desktop (Kanan) - Sembunyi di Mobile */}
        <div className="hidden md:block">
          <Link 
            href="/#contact" 
            className="bg-gradient-to-r from-[#2C4CAB] via-[#7EBAFF] to-[#62A8F9] border-[3px] border-[#2C4CAB] text-white font-bold py-2 px-6 rounded-full shadow-lg transition-all transform hover:-translate-y-1 hover:brightness-110 flex items-center gap-2"
          >
            Work Together
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/>
            </svg>
          </Link>
        </div>

        {/* Hamburger Button (Mobile) */}
        <button 
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 space-y-1.5 z-50 focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          <motion.span 
            animate={isOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
            className="w-7 h-1 bg-[#283870] rounded-full block"
          ></motion.span>
          <motion.span 
            animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
            className="w-7 h-1 bg-[#283870] rounded-full block"
          ></motion.span>
          <motion.span 
            animate={isOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
            className="w-7 h-1 bg-[#283870] rounded-full block"
          ></motion.span>
        </button>
      </div>

      {/* Menu Dropdown Mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-20 left-0 w-full bg-white shadow-xl border-b border-gray-100 md:hidden flex flex-col px-6 py-8 gap-6 h-screen"
          >
            <div className="flex flex-col gap-6 text-xl font-extrabold text-[#283870]">
              <Link href="/" onClick={closeMenu} className="border-b border-gray-100 pb-4">Home</Link>
              <Link href="/#about" onClick={closeMenu} className="border-b border-gray-100 pb-4">About</Link>
              <Link href="/work" onClick={closeMenu} className="border-b border-gray-100 pb-4">Work</Link>
            </div>
            
            <Link 
              href="/#contact" 
              onClick={closeMenu}
              className="mt-4 bg-gradient-to-r from-[#2C4CAB] via-[#7EBAFF] to-[#62A8F9] border-[3px] border-[#2C4CAB] text-white font-bold py-4 px-6 rounded-2xl shadow-lg flex justify-center items-center gap-2 active:scale-95 transition-transform"
            >
              Work Together
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/>
              </svg>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}