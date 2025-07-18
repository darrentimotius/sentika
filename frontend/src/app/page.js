"use client";

import TextForm from "@/components/textForm";
import FileUpload from "@/components/fileUpload";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto space-y-10">
        <h1 className="text-2xl font-bold text-center">🎯 Sentiment Analyzer</h1>
        <TextForm />
        <FileUpload />
      </div>
    </main>
  );
}
