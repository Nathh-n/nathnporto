"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase"; // Import Supabase

export default function UserHomePage() {
  const [photos, setPhotos] = useState([
    "/fotoprofile.png", 
    "/foto2.jpg", 
    "/foto3.jpg", 
  ]);

  const handlePhotoClick = () => {
    setPhotos((prev) => {
      const newArray = [...prev];
      const frontPhoto = newArray.shift(); 
      if (frontPhoto) newArray.push(frontPhoto); 
      return newArray;
    });
  };

  const jobdesk = ["Designer Graphic", "UI/UX Designer", "Front End Developer", "Back End Developer"];

  // --- STATE UNTUK FORM KONTAK ---
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: "a936b0d4-521f-41c6-8f6e-f979881747cb", // <--- GANTI INI
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          message: formData.message,
          subject: `Pesan Baru dari Portofolio - ${formData.name}`,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setSubmitStatus("success");
        setFormData({ name: "", phone: "", email: "", message: "" }); // Kosongkan form
        setTimeout(() => setSubmitStatus("idle"), 5000); // Hilangkan notif sukses setelah 5 detik
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // State untuk menyimpan data dari Database
  const [designThumbnails, setDesignThumbnails] = useState<any[]>([]);
  const [codingProjects, setCodingProjects] = useState<any[]>([]);
  const [behindMyWorks, setBehindMyWorks] = useState<any[]>([]);

  // Fungsi untuk menarik data dari Supabase saat halaman dimuat
  useEffect(() => {
    const fetchAllData = async () => {
      // 1. Tarik 5 Desain yang "is_featured = true"
      const { data: designs } = await supabase
        .from("design_projects")
        .select("*")
        .eq("is_featured", true)
        .order("created_at", { ascending: false })
        .limit(5);
      
      if (designs) setDesignThumbnails(designs);

      // 2. Tarik 3 Coding Project terbaru
      const { data: codes } = await supabase
        .from("coding_projects")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(3);

      if (codes) setCodingProjects(codes);

      // 3. Tarik semua Tools
      const { data: toolsData } = await supabase
        .from("tools")
        .select("*")
        .order("created_at", { ascending: false });

      if (toolsData) setBehindMyWorks(toolsData);
    };

    fetchAllData();
  }, []);

  return (
    <main className="min-h-screen bg-white overflow-hidden pb-10">
      
      {/* SECTION 1: HERO */}
      <section className="pt-45 pb-16 flex justify-center items-center relative overflow-hidden">
        <div className="absolute inset-0 z-0 h-full w-full bg-white bg-[linear-gradient(to_right,#dbeafe_1px,transparent_1px),linear-gradient(to_bottom,#dbeafe_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        <div className="relative z-10 w-full max-w-6xl h-80 md:h-[500px]">
          <Image 
            src="/tulisan-portobaru.png" 
            alt="Portfolio Typography" 
            fill 
            className="object-contain"
            priority
            sizes="(max-width: 768px) 100vw, 1200px" 
          />
        </div>
      </section>
      
      {/* SECTION 2: PITA TEKS BERJALAN (MARQUEE) */}
      <div className="mt-25 bg-gradient-to-r from-[#2C4CAB] to-[#94B7F3] text-white py-3 -rotate-2 scale-110 shadow-md overflow-hidden whitespace-nowrap mb-24">
        <div className="animate-marquee-custom text-xl font-bold tracking-widest flex">
          <div className="flex gap-4 pr-4">
            {[...Array(8)].map((_, i) => (
              <span key={`group1-${i}`}>Graphic Designer – Front End Programmer – </span>
            ))}
          </div>
          <div className="flex gap-4 pr-4">
            {[...Array(8)].map((_, i) => (
              <span key={`group2-${i}`}>Graphic Designer – Front End Programmer – </span>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 3: ABOUT ME */}
      <section id="about" className="mt-50 max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-16">
        <div className="relative w-72 h-80 md:w-96 md:h-[400px] cursor-pointer" onClick={handlePhotoClick}>
          {photos.map((photo, index) => {
            const isFront = index === 0;
            const rotation = isFront ? -4 : index === 1 ? 6 : -10;
            const scale = isFront ? 1 : index === 1 ? 0.95 : 0.9;
            const zIndex = 3 - index;
            const yOffset = index * 15;

            return (
              <motion.div
                key={photo}
                layout
                initial={false}
                animate={{ rotate: rotation, scale: scale, y: yOffset, zIndex: zIndex }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="absolute inset-0 bg-white p-4 pb-12 rounded-sm shadow-xl border border-gray-200"
              >
                <div className="relative w-full h-full bg-gray-200 overflow-hidden">
                  <Image src={photo} alt={`Foto ${index}`} fill className="object-cover" sizes="(max-width: 768px) 288px, 384px" priority={index === 0} />
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="flex-1">
          <h2 className="text-5xl font-extrabold text-[#3B5BDB] mb-6">About Me</h2>
          <p className="text-gray-700 text-lg leading-relaxed mb-8">
            Saya adalah seorang pelajar dan desainer grafis yang juga sangat tertarik dengan dunia pengembangan web. Memadukan estetika visual dengan kode yang rapi adalah hal yang saya sukai. Saya berfokus pada pembuatan antarmuka yang menarik sekaligus fungsional.
          </p>
          <h3 className="text-xl font-bold text-gray-800 mb-4">Jobdesk:</h3>
          <div className="flex flex-wrap gap-3">
            {jobdesk.map((item) => (
              <span key={item} className="bg-gradient-to-r from-[#62A8F9] to-[#C4DAFF] text-white border-2 border-[#62A8F9] font-bold py-2 px-4 rounded-xl shadow-sm">
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: PROJECTS & BEHIND MY WORKS */}
      <section className="relative w-full bg-gradient-to-b from-[#87BAF9] to-[#5C9DF2] pt-16 pb-12 flex flex-col items-center mt-32 overflow-hidden z-10">
        
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] md:w-[120%] h-[350px] md:h-[450px] bg-white rounded-b-[100%] z-0"></div>

        {/* --- DESIGN PROJECTS --- */}
        <div className="relative z-10 flex flex-col items-center mt-4 md:mt-8">
          <h2 className="text-4xl font-extrabold text-[#283870] mb-16 md:mb-24">Design Projects</h2>
          <Link href="/work" className="relative flex flex-col items-center cursor-pointer group">
            <motion.div className="relative w-64 h-64 md:w-80 md:h-80 flex items-end justify-center" initial="rest" whileHover="hover" whileTap="hover">
              {designThumbnails.map((item, index) => {
                const spreadVariants = {
                  rest: { opacity: 0, y: 0, x: 0, rotate: 0, scale: 0.3 },
                  hover: {
                    opacity: 1,
                    y: [ -40, -120, -150, -120, -40 ][index] || -100, // Fallback jika lebih dari 5
                    x: [ -130, -70, 0, 70, 130 ][index] || 0,
                    rotate: [ -25, -12, 0, 12, 25 ][index] || 0,
                    scale: 1,
                    transition: { type: "spring", stiffness: 300, damping: 20, delay: index * 0.03 }
                  }
                };

                return (
                  <motion.div key={item.id} variants={spreadVariants as any} className="absolute top-10 w-32 h-44 md:w-40 md:h-52 rounded-xl shadow-2xl border-[3px] border-white overflow-hidden z-0 bg-gray-200">
                    {/* Menggunakan image_url dari Supabase */}
                    <Image src={item.image_url} alt={item.title || `Design ${index + 1}`} fill className="object-cover" sizes="(max-width: 768px) 150px, 200px" />
                  </motion.div>
                );
              })}
              <motion.div className="relative w-56 h-56 md:w-72 md:h-72 z-10 drop-shadow-2xl" variants={{ rest: { y: 0, scale: 1 }, hover: { y: 20, scale: 1.05, transition: { type: "spring", stiffness: 400, damping: 25 } }}}>
                <Image src="/folder3d.png" alt="Design Projects Folder" fill className="object-contain" sizes="(max-width: 768px) 224px, 288px" />
              </motion.div>
            </motion.div>
            <span className="mt-8 text-white text-sm font-semibold tracking-wide animate-pulse md:hidden bg-blue-900/20 py-2 px-6 rounded-full border border-white/20">
              Ketuk untuk melihat karya desain
            </span>
          </Link>
        </div>

        {/* --- CODING PROJECTS --- */}
        <div className="relative z-10 flex flex-col items-center mt-32 w-full max-w-6xl px-6">
          <h2 className="text-4xl font-extrabold text-white mb-2 drop-shadow-md">Coding Projects</h2>
          <p className="text-blue-100 font-medium mb-12">A showcase for my recent work</p>
          
          {codingProjects.length === 0 ? (
             <div className="text-white/60 font-medium py-10">Belum ada project coding.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
              {codingProjects.map((project) => (
                <div key={project.id} className="bg-white rounded-[24px] p-5 flex flex-col shadow-lg hover:shadow-2xl transition-shadow duration-300">
                  {/* Menampilkan Gambar Coding Project */}
                  <div className="relative w-full h-44 bg-gray-200 rounded-xl mb-5 overflow-hidden">
                    {project.image_url && <Image src={project.image_url} alt={project.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />}
                  </div>
                  <h3 className="font-extrabold text-gray-800 text-lg mb-1">{project.title}</h3>
                  <p className="text-gray-500 text-xs font-semibold mb-6 line-clamp-2">{project.description}</p>
                  <div className="flex justify-between items-end mt-auto">
                    <div className="flex flex-wrap gap-2">
                      {project.tags?.map((tag: string) => (
                        <span key={tag} className="text-[10px] font-bold bg-gray-100 text-gray-500 px-2.5 py-1 rounded border border-gray-200">{tag}</span>
                      ))}
                    </div>
                    <Link href={project.link || "#"} target="_blank" className="bg-[#62A8F9] hover:bg-[#4a8bdb] text-white text-xs font-bold py-2 px-4 rounded-lg flex items-center gap-1 transition-colors whitespace-nowrap ml-2">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                      Demo
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {codingProjects.length > 0 && (
            <Link href="/work" className="mt-12 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-bold py-3 px-10 rounded-full transition-all border border-white/30">
              Show More
            </Link>
          )}
        </div>

        {/* --- BEHIND MY WORKS --- */}
        <div className="relative z-10 flex flex-col items-center mt-32 w-full max-w-5xl px-6 mb-10"> 
          <h2 className="text-4xl font-extrabold text-white mb-12 drop-shadow-md">Behind My Works</h2>
          
          {behindMyWorks.length === 0 ? (
            <div className="text-white/60 font-medium py-4">Belum ada tools yang ditambahkan.</div>
          ) : (
            <div className="flex flex-wrap justify-center gap-6 w-full">
              {behindMyWorks.map((item) => (
                <div key={item.id} className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-3xl shadow-lg flex flex-col items-center justify-center p-3 hover:scale-105 transition-transform group">
                  <div className="relative w-10 h-10 md:w-14 md:h-14 mb-2">
                    {/* Render Icon Gambar */}
                    {item.icon_url && <Image src={item.icon_url} alt={item.name} fill className="object-contain group-hover:scale-110 transition-transform" />}
                  </div>
                  <div className="text-[10px] md:text-xs font-extrabold text-[#283870] text-center w-full truncate">
                    {item.name}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </section> 

      {/* SECTION 5: PITA TEKS BERJALAN 2 (PEMISAH SEAMLESS MIRING KANAN) */}
      <div className="relative w-full h-32 md:h-48 flex items-center justify-center overflow-hidden z-20 -mt-1">
        <div className="absolute top-0 left-0 w-full h-1/2 bg-[#5C9DF2] z-0"></div>
        <div className="relative z-10 w-[120%] rotate-2 bg-gradient-to-r from-[#2C4CAB] to-[#94B7F3] text-white py-3 md:py-4 shadow-xl flex whitespace-nowrap">
          <div className="animate-marquee-custom text-xl font-bold tracking-widest flex">
            <div className="flex gap-4 pr-4">
              {[...Array(8)].map((_, i) => (
                <span key={`group1-${i}`}>Graphic Designer – Front End Programmer – </span>
              ))}
            </div>
            <div className="flex gap-4 pr-4">
              {[...Array(8)].map((_, i) => (
                <span key={`group2-${i}`}>Graphic Designer – Front End Programmer – </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 6: GET IN TOUCH */}
      <section id="contact" className="max-w-5xl mx-auto px-6 py-10 relative z-20">
        <h2 className="text-4xl font-extrabold text-[#283870] text-center mb-12">Get in touch</h2>
        
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Kiri: Informasi Kontak */}
          <div className="w-full md:w-1/2 bg-gradient-to-br from-[#87BAF9] to-[#9CBDF7] rounded-[32px] p-10 text-white shadow-xl">
            <h3 className="text-3xl font-extrabold mb-4">Contact</h3>
            <p className="font-semibold mb-1">Phone: <span className="font-normal block mt-1">+62 812-3456-7890</span></p>
            <p className="font-semibold mb-10">Email: <span className="font-normal block mt-1">hello@nath.com</span></p>
            
            <h3 className="text-3xl font-extrabold mb-4">Open Time</h3>
            <p className="font-semibold mb-12">Always</p>
            
            <h3 className="text-3xl font-extrabold mb-4">Stay Connected</h3>
            <div className="flex gap-3">
              {[
                { name: "Instagram", url: "https://www.instagram.com/nathhh__n/", icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg> },
                { name: "Facebook", url: "https://web.facebook.com/nath.n.670693/", icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z"/></svg> },
                { name: "GitHub", url: "https://github.com/Nathh-n", icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg> },
                { name: "LinkedIn", url: "https://www.linkedin.com/in/nur-fatahillah-7946133b3/", icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> }
              ].map((social) => (
                <Link href={social.url} key={social.name} title={social.name} target="_blank" className="w-12 h-12 rounded-full border-[3px] border-white flex items-center justify-center hover:bg-white/30 transition-colors shadow-sm">
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>
          
          {/* Kanan: Form Kirim Pesan (SUDAH AKTIF) */}
          <form onSubmit={handleContactSubmit} className="w-full md:w-1/2 flex flex-col gap-5 justify-center relative">
            
            {/* Overlay Sukses */}
            {submitStatus === "success" && (
              <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-2xl border-2 border-green-400">
                <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h4 className="text-xl font-extrabold text-green-600 mb-1">Pesan Terkirim!</h4>
                <p className="text-green-700/70 font-semibold text-center px-6">Terima kasih, pesan Anda akan segera saya balas.</p>
              </div>
            )}

            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              required
              placeholder="Full name" 
              className="w-full bg-[#EFEFEF] text-gray-700 font-semibold rounded-2xl p-4 outline-none focus:ring-4 focus:ring-[#87BAF9]/50 transition-all disabled:opacity-50" 
            />
            <input 
              type="tel" 
              name="phone"
              value={formData.phone}
              onChange={handleFormChange}
              placeholder="Phone Number (Optional)" 
              className="w-full bg-[#EFEFEF] text-gray-700 font-semibold rounded-2xl p-4 outline-none focus:ring-4 focus:ring-[#87BAF9]/50 transition-all disabled:opacity-50" 
            />
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleFormChange}
              required
              placeholder="Email" 
              className="w-full bg-[#EFEFEF] text-gray-700 font-semibold rounded-2xl p-4 outline-none focus:ring-4 focus:ring-[#87BAF9]/50 transition-all disabled:opacity-50" 
            />
            <textarea 
              name="message"
              value={formData.message}
              onChange={handleFormChange}
              required
              placeholder="Message" 
              rows={5} 
              className="w-full bg-[#EFEFEF] text-gray-700 font-semibold rounded-2xl p-4 outline-none focus:ring-4 focus:ring-[#87BAF9]/50 transition-all resize-none disabled:opacity-50"
            ></textarea>
            
            {submitStatus === "error" && (
              <p className="text-red-500 font-bold text-sm">Gagal mengirim pesan. Silakan coba lagi.</p>
            )}

            <div className="flex justify-end mt-2">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-[#4882F0] hover:bg-[#3267CC] text-white font-bold py-4 px-10 rounded-2xl transition-all hover:-translate-y-1 shadow-lg disabled:opacity-50 disabled:hover:translate-y-0 flex items-center gap-2"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </div>
          </form>
          
        </div>
      </section>
    </main>
  );
}