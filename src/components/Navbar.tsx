import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-slate-50/80 backdrop-blur-md border-b border-slate-200 transition-all">
      <div className="max-w-6xl mx-auto px-6 h-20 flex justify-between items-center">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
          <Image
            src="/tulisan-porto.png"
            alt="Logo Portfolio"
            width={130}
            height={40}
            className="h-8 w-auto object-contain"
            priority
          />
        </Link>

        {/* Menu Navigasi - Jarak lebih lega dan font lebih elegan */}
        <div className="hidden md:flex items-center gap-10 text-sm font-semibold text-slate-600">
          <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <Link href="#about" className="hover:text-blue-600 transition-colors">About</Link>
          <Link href="/projects" className="hover:text-blue-600 transition-colors">Projects</Link>
        </div>

        {/* Tombol Call to Action */}
        <div className="hidden md:block">
          <Link
            href="/order"
            className="px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-full hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all"
          >
            Hire Me
          </Link>
        </div>

        {/* Tombol Hamburger untuk Mode HP */}
        <button className="md:hidden text-slate-800">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>

      </div>
    </nav>
  );
}