import "../globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer"; // 1. Import Footer-nya

export const metadata = {
  title: "Portofolio | Design & Code",
  description: "Karya Desain Grafis dan Pengembangan Web",
};

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className="bg-slate-50 text-slate-900 antialiased min-h-screen flex flex-col font-sans">
        <Navbar />
        <main className="flex-grow pt-24">
          {children}
        </main>
        <Footer /> {/* 2. Pasang di sini agar selalu ada di bawah */}
      </body>
    </html>
  );
}