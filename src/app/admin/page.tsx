import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-white">Dashboard Admin</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link 
          href="/admin/categories" 
          className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl hover:bg-zinc-800 transition block text-center"
        >
          <h2 className="text-xl font-semibold text-blue-400 mb-2">Manajemen Kategori</h2>
          <p className="text-zinc-400">Tambah atau edit kategori portofolio.</p>
        </Link>

        <Link 
          href="/admin/upload" 
          className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl hover:bg-zinc-800 transition block text-center"
        >
          <h2 className="text-xl font-semibold text-green-400 mb-2">Upload Portofolio</h2>
          <p className="text-zinc-400">Unggah karya atau project terbarumu.</p>
        </Link>
      </div>
    </div>
  );
}