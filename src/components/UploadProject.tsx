"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function UploadProject() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  // Tambahan state untuk kategori
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  // Ambil data kategori saat komponen dimuat
  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from("categories").select("*");
      if (data) setCategories(data);
    };
    fetchCategories();
  }, []);

  const handleUpload = async () => {
    if (!imageFile || !selectedCategory) {
      alert("Pilih gambar dan kategori terlebih dahulu!");
      return;
    }

    // nama file unik
    const fileName = `${Date.now()}-${imageFile.name}`;

    // upload gambar ke storage
    const { error: uploadError } = await supabase.storage
      .from("portfolio-images")
      .upload(fileName, imageFile);

    if (uploadError) {
      console.log(uploadError);
      alert("Upload gambar gagal");
      return;
    }

    // ambil public url gambar
    const { data } = supabase.storage
      .from("portfolio-images")
      .getPublicUrl(fileName);

    const imageUrl = data.publicUrl;

    // simpan ke database dengan category_id
    const { error: dbError } = await supabase
      .from("projects")
      .insert([
        {
          title,
          description,
          image: imageUrl,
          category_id: selectedCategory, // Ini yang disesuaikan
        },
      ]);

    if (dbError) {
      console.log(dbError);
      alert("Gagal simpan database");
      return;
    }

    alert("Project berhasil upload!");

    setTitle("");
    setDescription("");
    setImageFile(null);
    setSelectedCategory("");
  };

  return (
    <div className="bg-zinc-900 p-6 rounded-2xl mb-10">
      <h2 className="text-2xl font-bold mb-6 text-white">Upload New Project</h2>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Judul Project"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-zinc-800 text-white border border-zinc-700 rounded-lg p-3"
        />

        {/* Tambahan Dropdown Kategori */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full bg-zinc-800 text-white border border-zinc-700 rounded-lg p-3"
        >
          <option value="" disabled>-- Pilih Kategori --</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <textarea
          placeholder="Deskripsi"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full bg-zinc-800 text-white border border-zinc-700 rounded-lg p-3 h-32"
        />

        <input
          type="file"
          onChange={(e) => {
            if (e.target.files) {
              setImageFile(e.target.files[0]);
            }
          }}
          className="text-sm text-zinc-400"
        />

        <button
          onClick={handleUpload}
          className="bg-blue-500 hover:bg-blue-600 text-white transition px-6 py-3 rounded-lg font-semibold"
        >
          Upload Project
        </button>
      </div>
    </div>
  );
}