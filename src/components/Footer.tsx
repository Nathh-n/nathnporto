import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t-2 border-blue-50 py-10 mt-auto relative z-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Logo dengan efek gradasi */}
        <div className="text-2xl font-extrabold tracking-tighter cursor-default">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2C4CAB] to-[#62A8F9]">
            nathh.cdr
          </span>
        </div>
        
        {/* Teks Copyright */}
        <p className="text-gray-400 text-sm font-semibold text-center">
          © {new Date().getFullYear()} NathhN Portfolio. All rights reserved.
        </p>
        
        {/* Social Links - Dibuat bergaya tombol kapsul (Pill) */}
        <div className="flex items-center gap-3 text-sm font-bold">
          <Link 
            href="mailto:nurfatahillah000@gmail.com" 
            className="bg-blue-50 text-[#2C4CAB] hover:bg-gradient-to-r hover:from-[#62A8F9] hover:to-[#C4DAFF] hover:text-white px-5 py-2.5 rounded-full transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1"
          >
            Email
          </Link>
          <Link 
            href="https://github.com/Nathh-n" 
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-50 text-[#2C4CAB] hover:bg-gradient-to-r hover:from-[#62A8F9] hover:to-[#C4DAFF] hover:text-white px-5 py-2.5 rounded-full transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1"
          >
            GitHub
          </Link>
          <Link 
            href="https://www.instagram.com/nathhh__n/" 
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-50 text-[#2C4CAB] hover:bg-gradient-to-r hover:from-[#62A8F9] hover:to-[#C4DAFF] hover:text-white px-5 py-2.5 rounded-full transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1"
          >
            Instagram
          </Link>
        </div>
        
      </div>
    </footer>
  );
}