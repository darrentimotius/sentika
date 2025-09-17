"use client";

export default function Loader({ label = "Memproses" }) {
  return (
    <div className="flex items-center gap-2 text-sm text-slate-500">
      <span className="relative flex size-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400/60 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
      </span>
      {label}...
    </div>
  );
}
