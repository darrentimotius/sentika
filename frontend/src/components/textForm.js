"use client";

import { useState, useRef, useEffect } from "react";
import SentimentBadge from "@/components/SentimentBadge";
import Loader from "@/components/Loader";

export default function TextForm() {
  const [text, setText] = useState("");
  const charLimit = 500; // batas karakter
  const textareaRef = useRef(null);
  const [inferTime, setInferTime] = useState(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    const max = 280; // px max height before scroll
    el.style.height = Math.min(el.scrollHeight, max) + 'px';
  }, [text]);
  const [result, setResult] = useState(null); // { sentiment, confidence }
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);
    setError(null);
    setLoading(true);
    setInferTime(null);
    try {
      const start = performance.now();
      const res = await fetch("/api/text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error("Server error");
      const data = await res.json();
      if (!data?.sentiment) throw new Error("Format respons tidak valid");
      setResult({ sentiment: data.sentiment, confidence: data.confidence });
      setInferTime(Math.round(performance.now() - start));
    } catch (err) {
      setError("Gagal memproses teks. Coba lagi.");
    }
    setLoading(false);
  };

  const disabled = loading || !text.trim();

  // keyboard shortcut
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && !loading && text.trim()) {
        handleSubmit(e);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [loading, text]);

  // Dynamic border removed (rollback) -> static focus-only border behavior

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="group relative rounded-xl border border-transparent group-focus-within:border-slate-600 transition-colors duration-300">
        <textarea
          ref={textareaRef}
          className="w-full resize-none rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 text-slate-100 placeholder-slate-500 p-4 pr-12 text-sm shadow-inner shadow-black/40 transition focus:outline-none disabled:opacity-50 caret-fuchsia-300 selection:bg-fuchsia-600/70 selection:text-white"
          placeholder="Tulis teks atau review produk di sini..."
          rows={5}
          value={text}
          onChange={(e) => {
            const val = e.target.value;
            if (val.length <= charLimit) setText(val);
          }}
          required
          disabled={loading}
        />
        <div className="absolute -bottom-5 left-0 w-full flex items-center justify-between pr-1 pt-1">
          <div className="h-1 flex-1 mr-2 overflow-hidden rounded-full bg-slate-700/60">
            <div
              className={`h-full transition-all duration-300 ${
                (text.length / charLimit) > 0.85
                  ? 'bg-rose-500'
                  : (text.length / charLimit) > 0.6
                  ? 'bg-amber-400'
                  : 'bg-blue-500'
              }`}
              style={{ width: `${(text.length / charLimit) * 100}%` }}
            />
          </div>
          <span className={`text-[10px] font-medium select-none ${
            (text.length / charLimit) > 0.85
              ? 'text-rose-400'
              : (text.length / charLimit) > 0.6
              ? 'text-amber-300'
              : 'text-slate-400'
          }`}>
            {text.length}/{charLimit}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <button
          type="submit"
          disabled={disabled}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow hover:from-blue-500 hover:to-indigo-500 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:bg-slate-800 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 disabled:shadow-none disabled:cursor-not-allowed transition"
        >
          {loading ? (
            <>
              <Spinner /> Memproses
            </>
          ) : (
            <>
              <BoltIcon /> Prediksi
            </>
          )}
        </button>
        {text && !loading && (
          <button
            type="button"
            onClick={() => setText("")}
            className="text-[11px] font-medium text-slate-400 hover:text-slate-200 transition px-2 py-1 rounded-md border border-slate-600 hover:border-slate-400 bg-slate-800/60"
            aria-label="Clear text"
          >
            Clear
          </button>
        )}
        {loading && !result && <Loader />}
      </div>
      {error && (
        <p className="text-xs font-medium text-rose-600 bg-rose-50 border border-rose-200 rounded-md px-3 py-2">
          {error}
        </p>
      )}
      {result && (
        <div className="space-y-4 rounded-xl border border-slate-700 bg-gradient-to-br from-slate-900/80 to-slate-800/80 p-4 backdrop-blur-md shadow-inner shadow-black/40">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Hasil</h3>
              <SentimentBadge sentiment={result.sentiment} confidence={result.confidence} />
            </div>
            <CopyButton text={text} />
          </div>
          <ConfidenceBar confidence={result.confidence} sentiment={result.sentiment} />
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <p>Perkiraan keyakinan model terhadap sentimen.</p>
            {inferTime !== null && <span className="text-slate-400">{inferTime} ms</span>}
          </div>
        </div>
      )}
    </form>
  );
}

function Spinner() {
  return (
    <span className="relative flex size-4">
      <span className="animate-spin inline-block size-4 rounded-full border-[3px] border-white/40 border-t-white" />
    </span>
  );
}

function BoltIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="stroke-current">
      <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ConfidenceBar({ confidence = 0, sentiment }) {
  const pct = Math.min(100, Math.max(0, confidence * 100));
  const color = sentiment === "positive" ? "from-emerald-400 to-emerald-600" : sentiment === "negative" ? "from-rose-400 to-rose-600" : "from-slate-400 to-slate-600";
  return (
    <div className="w-full">
      <div className="flex justify-between text-[11px] font-medium text-slate-500 mb-1">
        <span>Confidence</span>
        <span>{pct.toFixed(2)}%</span>
      </div>
  <div className="h-2 w-full rounded-full bg-slate-700/60 overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${color} transition-all duration-500 ease-out`}
          style={{ width: pct + "%" }}
        />
      </div>
    </div>
  );
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard.writeText(text || "");
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="group inline-flex items-center gap-1 rounded-md border border-slate-600 bg-slate-800/60 px-2 py-1 text-[11px] font-medium text-slate-300 transition hover:text-white hover:border-slate-400"
      aria-label="Copy original text"
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="stroke-current">
        <rect x="8" y="8" width="12" height="12" rx="2" strokeWidth="2" />
        <path d="M4 16V6a2 2 0 0 1 2-2h10" strokeWidth="2" strokeLinecap="round" />
      </svg>
      {copied ? <span className="text-emerald-400">Copied</span> : <span>Copy</span>}
    </button>
  );
}


