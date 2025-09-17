"use client";

import { useState } from "react";
import TextForm from "@/components/textForm";
import FileUpload from "@/components/fileUpload";

export default function Home() {
  const [tab, setTab] = useState("text");
  const tabs = [
    { id: "text", label: "Analisis Teks" },
    { id: "file", label: "Batch via File" },
  ];

return (
    <main className="min-h-screen relative overflow-hidden text-white">
        {/* Background gradient */}
        <div className="pointer-events-none absolute inset-0 -z-10 [background:radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.25),transparent_60%),radial-gradient(circle_at_70%_60%,rgba(147,51,234,0.18),transparent_55%)]" />
        <div className="absolute inset-0 -z-10 backdrop-blur-3xl" />

        <div className="mx-auto max-w-5xl px-6 py-14">
            <header className="mb-12 space-y-5 text-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-500/60 bg-gradient-to-br from-slate-800/70 via-slate-700/60 to-slate-800/50 px-4 py-1.5 text-[11px] font-medium tracking-wide text-slate-300 shadow-[0_0_0_1px_rgba(255,255,255,0.07),0_6px_18px_-4px_rgba(0,0,0,0.5)] backdrop-blur-lg">
                    <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-slate-100">Real-time Indonesian Sentiment AI</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-blue-400 via-cyan-200 to-white bg-clip-text text-transparent">
                    Sentika: Sentiment Analyzer
                </h1>
                <p className="mx-auto max-w-2xl text-sm md:text-base leading-relaxed text-slate-100">
                    Analisis sentimen Bahasa Indonesia secara instan. Masukkan teks tunggal atau unggah file CSV/TXT untuk prediksi massal.
                </p>
            </header>

            <section className="mx-auto max-w-3xl">
                <div className="mb-6 inline-flex rounded-xl border border-slate-600/60 bg-gradient-to-r from-slate-800/80 via-slate-800/60 to-slate-700/50 p-1 shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_4px_14px_-2px_rgba(0,0,0,0.5)] backdrop-blur-md">
                    {tabs.map((t) => {
                        const active = tab === t.id;
                        return (
                            <button
                                key={t.id}
                                onClick={() => setTab(t.id)}
                                className={`relative rounded-lg px-5 py-2 text-xs md:text-sm font-medium transition focus:outline-none outline-none ${
                                    active
                                        ? 'text-white'
                                        : 'text-slate-400 hover:text-slate-200'
                                }`}
                            >
                                {active && (
                                    <span className="absolute inset-0 -z-10 rounded-lg bg-gradient-to-br from-blue-700/70 via-blue-600/60 to-cyan-500/40 shadow ring-1 ring-white/10" />
                                )}
                                <span className="relative flex items-center gap-2">
                                  {active && <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_6px_2px_rgba(34,211,238,0.55)]" />}
                                  {t.label}
                                </span>
                            </button>
                        );
                    })}
                </div>

                <div className="rounded-2xl border border-slate-500/60 bg-gradient-to-br from-slate-800/70 via-slate-700/60 to-slate-800/50 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.07),0_6px_24px_-4px_rgba(0,0,0,0.55)] backdrop-blur-lg">
                    {tab === "text" ? <TextForm /> : <FileUpload />}
                </div>
            </section>

            <footer className="mt-20 text-center text-[11px] text-slate-200">
                Model inference endpoint: api.sentika.site • Dibuat untuk analisis sentimen Bahasa Indonesia.
            </footer>
        </div>
    </main>
);
}

