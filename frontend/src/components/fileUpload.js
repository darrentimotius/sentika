"use client";

import { useState } from "react";
import Loader from "@/components/Loader";

export default function FileUpload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const validateCsvHasTextColumn = async (fileObj) => {
    // Only attempt for .csv; TXT assumed raw lines, skip validation
    if (!fileObj || !fileObj.name.toLowerCase().endsWith('.csv')) return true;
    try {
      const text = await fileObj.text();
      const firstLine = text.split(/\r?\n/)[0];
      if (!firstLine) return false;
      const headers = firstLine.split(/[,;\t]/).map(h => h.trim().replace(/^"|"$/g, ''));
      return headers.map(h => h.toLowerCase()).includes('text');
    } catch {
      return false;
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setError(null);
    setSuccess(false);

    const valid = await validateCsvHasTextColumn(file);
    if (!valid) {
      setLoading(false);
      setError("File CSV harus memiliki kolom bernama 'text' pada header baris pertama.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("http://api.sentika.site/predict_file", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload gagal");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "hasil_sentimen.csv";
      link.click();
      setSuccess(true);
    } catch (err) {
      setError(err.message.includes('Upload gagal') ? "Gagal mengunggah file. Pastikan format benar & kolom 'text' tersedia." : "Gagal mengunggah file. Coba lagi.");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleUpload} className="space-y-4">
      <div className="group relative rounded-xl border border-transparent group-hover:border-slate-600 transition-colors duration-300">
      <label
        className="flex flex-col items-center justify-center w-full cursor-pointer rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 p-4 min-h-[140px] text-center text-xs text-slate-400 transition shadow-inner shadow-black/40"
      >
        <input
          type="file"
            accept=".csv,.txt"
            onChange={(e) => setFile(e.target.files[0])}
            className="hidden"
        />
        <UploadIcon />
        <span className="font-medium mt-2 text-slate-200 truncate max-w-full px-2">{file ? file.name : "Pilih CSV / TXT"}</span>
  <span className="mt-1 text-[10px] text-slate-500">File harus punya header kolom: <span className="text-slate-300 font-semibold">text</span>. Setelah upload hasil otomatis diunduh.</span>
  </label>
  </div>
      <div className="flex items-center gap-4 flex-wrap">
        <button
          type="submit"
          disabled={!file || loading}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow hover:from-blue-500 hover:to-indigo-500 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:bg-slate-800 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 disabled:shadow-none disabled:cursor-not-allowed transition"
        >
          {loading ? <Loader label="Mengunggah" /> : <><CloudIcon /> Upload & Prediksi</>}
        </button>
        {success && <span className="text-xs font-medium text-emerald-400">Berhasil! File terunduh.</span>}
      </div>
      {error && (
        <p className="text-xs font-medium text-rose-600 bg-rose-50 border border-rose-200 rounded-md px-3 py-2">{error}</p>
      )}
    </form>
  );
}

function UploadIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="stroke-slate-400">
      <path d="M12 16V4m0 0 4 4m-4-4-4 4M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CloudIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="stroke-current">
      <path d="M6 14a4 4 0 0 1 .4-1.8A5 5 0 0 1 12 5a5 5 0 0 1 4.6 3A4 4 0 1 1 18 17H7a3 3 0 0 1-1-5.8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

