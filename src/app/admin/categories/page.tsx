"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function CategoriesPage() {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState<any[]>([]);

  // Mengambil data kategori
  const fetchCategories = async () => {
    const { data } = await supabase.from("categories").select("*").order("created_at", { ascending: false });
    if (data) setCategories(data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Fungsi tambah kategori
  const handleAddCategory = async () => {
    if (!name) return alert("Nama kategori tidak boleh kosong!");

    const { error } = await supabase.from("categories").insert([{ name }]);

    if (error) {
      alert("Gagal menambahkan kategori. Pastikan namanya belum ada.");
      console.log(error);
    } else {
      alert("Kategori berhasil ditambahkan!");
      setName("");
      fetchCategories(); // Refresh daftar kategori
    }
  };

  return (
    <div className="p-10 max-w-2xl mx-auto text-white">
      <h1 className="text-3xl font-bold mb-8">Manajemen Kategori</h1>

      {/* Form Tambah Kategori */}
      <div className="bg-zinc-900 p-6 rounded-2xl mb-8 border border-zinc-800">
        <h2 className="text-xl font-semibold mb-4">Tambah Kategori Baru</h2>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Contoh: UI/UX Design"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg p-3"
          />
          <button
            onClick={handleAddCategory}
            className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg font-semibold transition"
          >
            Simpan
          </button>
        </div>
      </div>

      {/* Daftar Kategori */}
      <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
        <h2 className="text-xl font-semibold mb-4">Daftar Kategori</h2>
        <ul className="space-y-3">
          {categories.map((cat) => (
            <li key={cat.id} className="bg-zinc-800 p-4 rounded-lg border border-zinc-700 flex justify-between">
              <span>{cat.name}</span>
            </li>
          ))}
          {categories.length === 0 && <p className="text-zinc-500">Belum ada kategori.</p>}
        </ul>
      </div>
    </div>
  );
}