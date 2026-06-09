"use client";

import { useUpscale } from "@/hooks/useUpscale";
import ScalePicker from "@/components/ScalePicker";
import ImageUploader from "@/components/ImageUploader";
import ResultPanel from "@/components/ResultPanel";
import ComparisonView from "@/components/ComparisonView";

export default function Home() {
  const {
    file,
    previewUrl,
    result,
    loading,
    scale,
    info,
    error,
    warning,
    loadingMessage,
    elapsedTime,
    handleFileChange,
    handleScaleChange,
    handleUpload,
  } = useUpscale();

  return (
    <main className="min-h-screen bg-gray-200 py-12 px-4 flex flex-col items-center">
      {/* Overlay pencegah interaksi ganda saat loading */}
      {loading && (
        <div className="absolute inset-0 z-50 bg-white/30 cursor-wait rounded-3xl" />
      )}

      <div className="max-w-4xl w-full space-y-8">
        {/* Judul */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Peningkatan Resolusi Citra
          </h1>
          <p className="text-gray-500 font-medium">Unggah dalam format PNG/JPG/JPEG/WEBP</p>
        </div>

        {/* Pemilih skala */}
        <ScalePicker
          scale={scale ?? 4}
          onScaleChange={handleScaleChange}
          disabled={loading}
        />

        {/* Panel upload (kiri) + panel hasil (kanan) */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ImageUploader
            previewUrl={previewUrl}
            loading={loading}
            scale={scale}
            warning={warning}
            error={error}
            info={info}
            loadingMessage={loadingMessage}
            elapsedTime={elapsedTime}
            onFileChange={handleFileChange}
            onUpload={handleUpload}
          />
          <ResultPanel
            loading={loading}
            result={result}
            loadingMessage={loadingMessage}
            elapsedTime={elapsedTime}
          />
        </section>

        {/* Perbandingan before-after — hanya muncul setelah hasil tersedia */}
        {result && previewUrl && (
          <ComparisonView
            previewUrl={previewUrl}
            result={result}
            scale={scale}
          />
        )}
      </div>
    </main>
  );
}
