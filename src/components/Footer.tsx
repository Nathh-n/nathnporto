import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 py-10 mt-auto">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        
        <div className="text-slate-800 font-bold tracking-widest text-lg">
          NATH<span className="text-blue-600">.</span>CDR
        </div>
        
        <p className="text-slate-500 text-sm font-medium">
          © {new Date().getFullYear()} My Portfolio. All rights reserved.
        </p>
        
        <div className="flex items-center gap-4 text-sm font-bold text-slate-500">
          <Link href="mailto:emailkamu@gmail.com" className="hover:text-blue-600 transition-colors">Email</Link>
          <Link href="https://github.com" className="hover:text-blue-600 transition-colors">GitHub</Link>
          <Link href="https://instagram.com" className="hover:text-blue-600 transition-colors">Instagram</Link>
        </div>
        
      </div>
    </footer>
  );
}