"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

export default function ToolsAdmin() {
  const [tools, setTools] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  // State Form
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchTools();
  }, []);

  const fetchTools = async () => {
    setIsFetching(true);
    const { data, error } = await supabase
      .from("tools")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) console.error("Error fetching:", error);
    else setTools(data || []);
    setIsFetching(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !file) return alert("Mohon isi nama aplikasi dan pilih ikonnya!");

    setIsLoading(true);
    try {
      // 1. Upload File Ikon
      const fileExt = file.name.split('.').pop();
      const fileName = `tool-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from("portofolio-assets")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // 2. Dapatkan URL Public
      const { data: publicUrlData } = supabase.storage
        .from("portofolio-assets")
        .getPublicUrl(fileName);
      const iconUrl = publicUrlData.publicUrl;

      // 3. Simpan ke Database
      const { error: insertError } = await supabase
        .from("tools")
        .insert([{ 
          name: name,
          icon_url: iconUrl
        }]);

      if (insertError) throw insertError;

      alert("Tool berhasil ditambahkan!");
      
      // Reset Form
      setName("");
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      
      fetchTools();
    } catch (error: any) {
      console.error("Error upload:", error);
      alert("Gagal menyimpan tool: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number, iconUrl: string) => {
    if (!window.confirm("Yakin ingin menghapus tool ini?")) return;

    try {
      // 1. Hapus dari database
      const { error: deleteDbError } = await supabase
        .from("tools")
        .delete()
        .eq("id", id);

      if (deleteDbError) throw deleteDbError;

      // 2. Hapus gambar fisik dari Storage
      if (iconUrl) {
        const filePath = iconUrl.split('/portofolio-assets/')[1];
        if (filePath) {
          await supabase.storage.from("portofolio-assets").remove([filePath]);
        }
      }

      setTools(tools.filter((t) => t.id !== id));
      alert("Tool berhasil dihapus!");
    } catch (error: any) {
      console.error("Error delete:", error);
      alert("Gagal menghapus tool: " + error.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#283870] mb-2">Tools & Skills</h1>
        <p className="text-gray-500 font-medium">Atur grid ikon framework atau aplikasi pada bagian "Behind My Works".</p>
      </div>

      {/* Form Input Baru */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-12">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Tambah Tool Baru</h2>
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-5 items-end">
          
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-600 mb-2">Nama Aplikasi / Framework</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Misal: CorelDRAW"
              className="w-full bg-gray-50 border border-gray-200 text-gray-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#87BAF9] transition-all"
            />
          </div>

          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-600 mb-2">Icon (PNG / SVG Transparan)</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="w-full bg-gray-50 border border-gray-200 text-gray-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#87BAF9] transition-all cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full md:w-auto bg-[#4882F0] hover:bg-[#3267CC] text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md disabled:opacity-50"
          >
            {isLoading ? "Menyimpan..." : "Tambah"}
          </button>
        </form>
      </div>

      {/* Daftar Tools (Format Grid Kotak) */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-6">Daftar Tools ({tools.length})</h2>
        {isFetching ? (
          <div className="text-center py-10 text-gray-500 font-medium animate-pulse">Memuat data...</div>
        ) : tools.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-2xl border border-gray-100 text-gray-500 font-medium">Belum ada tool yang ditambahkan.</div>
        ) : (
          <div className="flex flex-wrap gap-6">
            {tools.map((tool) => (
              <div key={tool.id} className="relative w-32 h-32 bg-white rounded-3xl shadow-md border border-gray-100 flex flex-col items-center justify-center p-4 group">
                
                {/* Ikon */}
                <div className="relative w-12 h-12 mb-3">
                  {tool.icon_url ? (
                    <Image src={tool.icon_url} alt={tool.name} fill className="object-contain" />
                  ) : (
                    <div className="w-full h-full bg-gray-200 rounded-lg"></div>
                  )}
                </div>
                
                {/* Nama Tool */}
                <p className="text-xs font-extrabold text-[#283870] text-center w-full truncate">
                  {tool.name}
                </p>

                {/* Tombol Hapus (Muncul saat di-hover) */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                  <button 
                    onClick={() => handleDelete(tool.id, tool.icon_url)}
                    className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold py-2 px-4 rounded-lg transform scale-95 group-hover:scale-100 transition-all shadow-lg"
                  >
                    Hapus
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}