"use client";

import { useState } from "react";

export default function textForm() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);
    setLoading(true);

    try {
      const res = await fetch("http://api.sentika.site/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      setResult(`${data.sentiment.toUpperCase()} (${(data.confidence * 100).toFixed(2)}%)`);
    } catch {
      setResult("❌ Gagal memproses teks.");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        className="w-full p-3 border rounded-md"
        placeholder="Masukkan teks untuk analisis sentimen..."
        rows={4}
        value={text}
        onChange={(e) => setText(e.target.value)}
        required
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? "Memproses..." : "Prediksi"}
      </button>
      {result && <p className="font-medium text-center mt-2">{result}</p>}
    </form>
  );
}
