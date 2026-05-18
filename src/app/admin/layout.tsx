import "../globals.css";
import Navbar from "@/components/Navbar";

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
        {/* Ubah pt-20 menjadi pt-28 di sini */}
        <main className="flex-grow pt-28">
          {children}
        </main>
      </body>
    </html>
  );
}