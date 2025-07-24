"use client";

import { useState } from "react";

export default function FileUpload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://api.sentika.site/predict_file", {
        method: "POST",
        body: formData,
      });

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "hasil_sentimen.csv";
      link.click();
    } catch {
      alert("❌ Gagal mengunggah file.");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleUpload} className="space-y-2">
      <input
        type="file"
        accept=".csv,.txt"
        onChange={(e) => setFile(e.target.files[0])}
        className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-blue-600 file:text-white hover:file:bg-blue-700"
      />
      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        disabled={loading}
      >
        {loading ? "Mengunggah..." : "Upload & Prediksi"}
      </button>
    </form>
  );
}
