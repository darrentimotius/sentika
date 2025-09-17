"use client";

// Simple sentiment badge with color mapping
export default function SentimentBadge({ sentiment = "neutral", confidence }) {
  const map = {
    positive: "bg-emerald-100 text-emerald-700 ring-emerald-500/20",
    negative: "bg-rose-100 text-rose-700 ring-rose-500/20",
    neutral: "bg-slate-100 text-slate-700 ring-slate-500/20",
  };
  const cls = map[sentiment?.toLowerCase()] || map.neutral;
  return (
    <div className="flex items-center gap-2">
      <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${cls}`}>
        <Dot sentiment={sentiment} />
        {sentiment?.toUpperCase() || "NEUTRAL"}
      </span>
      {typeof confidence === "number" && (
        <span className="text-xs font-medium text-slate-400">{(confidence * 100).toFixed(2)}%</span>
      )}
    </div>
  );
}

function Dot({ sentiment }) {
  const color = sentiment === "positive" ? "bg-emerald-500" : sentiment === "negative" ? "bg-rose-500" : "bg-slate-400";
  return <span className={`size-2 rounded-full ${color} animate-pulse`} />;
}
