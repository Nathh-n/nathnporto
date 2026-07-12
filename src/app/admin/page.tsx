"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AdminDashboard() {
  // Simulasi data statistik dari Supabase (nanti akan diganti dengan fungsi fetch/count)
  const stats = [
    { 
      id: 1, 
      title: "Design Projects", 
      count: 5, 
      color: "from-blue-500 to-cyan-400",
      icon: <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
    },
    { 
      id: 2, 
      title: "Coding Projects", 
      count: 3, 
      color: "from-indigo-500 to-blue-500",
      icon: <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
    },
    { 
      id: 3, 
      title: "Tools & Skills", 
      count: 6, 
      color: "from-[#283870] to-[#62A8F9]",
      icon: <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="max-w-6xl mx-auto pb-12">
      
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <h1 className="text-4xl font-extrabold text-[#283870] mb-2">Welcome to Command Center</h1>
        <p className="text-gray-500 font-medium text-lg">
          Kelola data portofoliomu agar selalu up-to-date untuk kebutuhan melamar kerja atau pameran karya.
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div 
        variants={containerVariants as any} /* <--- Tambahkan as any di sini */
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
      >
        {stats.map((stat) => (
          <motion.div 
            key={stat.id}
            variants={itemVariants as any} /* <--- Tambahkan as any di sini juga */
            className={`bg-gradient-to-br ${stat.color} rounded-3xl p-6 shadow-lg text-white relative overflow-hidden`}
          >
            <div className="relative z-10 flex justify-between items-start">
              <div>
                <p className="text-white/80 font-semibold mb-1">{stat.title}</p>
                <h3 className="text-5xl font-extrabold">{stat.count}</h3>
              </div>
              <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                {stat.icon}
              </div>
            </div>
            {/* Dekorasi background lingkaran abstrak */}
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Actions / Shortcuts */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-2xl font-extrabold text-[#283870] mb-6">Quick Actions</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card Shortcut 1 */}
          <Link href="/admin/design-projects" className="group bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Update Design</h3>
            <p className="text-gray-500 text-sm font-medium">Ubah 5 gambar thumbnail yang muncul saat folder di halaman utama di-hover.</p>
          </Link>

          {/* Card Shortcut 2 */}
          <Link href="/admin/coding-projects" className="group bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Manage Code Projects</h3>
            <p className="text-gray-500 text-sm font-medium">Tambah, edit, atau hapus kartu portofolio aplikasi dan web development.</p>
          </Link>

          {/* Card Shortcut 3 */}
          <Link href="/admin/tools" className="group bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="w-12 h-12 bg-[#E1EAFB] rounded-xl flex items-center justify-center text-[#283870] mb-4 group-hover:bg-[#283870] group-hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Adjust Tools</h3>
            <p className="text-gray-500 text-sm font-medium">Atur grid ikon framework/aplikasi pada bagian "Behind My Works".</p>
          </Link>

        </div>
      </motion.div>

    </div>
  );
}