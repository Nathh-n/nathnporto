import type { Metadata } from "next";
import "../globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
// 1. Import font Plus Jakarta Sans dari modul Google Fonts bawaan Next.js
import { Plus_Jakarta_Sans } from "next/font/google";

// 2. Konfigurasi font-nya
const plusJakartaSans = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"], // Memuat berbagai ketebalan huruf
});

// 3. Konfigurasi Metadata dan SEO (Tampilan saat link dibagikan)
export const metadata: Metadata = {
  title: "Nath | Graphic Designer & Front-End Developer",
  description: "Portofolio digital yang menampilkan karya desain grafis yang estetik serta antarmuka web yang interaktif.",
  openGraph: {
    title: "Nath | Portfolio",
    description: "Eksplorasi karya desain grafis dan proyek coding saya.",
    url: "https://portofolio-nath.vercel.app", // Nanti ini diganti dengan link asli Vercel-mu
    siteName: "Nath Portfolio",
    images: [
      {
        url: "/tulisan-portobaru.png", // Gambar yang akan muncul saat link dibagikan
        width: 1200,
        height: 630,
        alt: "Nath Portfolio Cover",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
};

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      {/* 4. Masukkan plusJakartaSans.className ke dalam tag <body> */}
      <body className={`${plusJakartaSans.className} bg-slate-50 text-slate-900 antialiased min-h-screen flex flex-col`}>
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}