"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

// Tipe data untuk skala pembesaran
type Scale = 2 | 4;

const SCALE_CONFIG: Record<
  Scale,
  { label: string; desc: string; color: string }
> = {
  2: {
    label: "2×",
    desc: "Skala pembesaran standar",
    color: "bg-violet-600 hover:bg-violet-700 shadow-violet-100",
  },
  4: {
    label: "4×",
    desc: "Skala pembesaran maksimal",
    color: "bg-blue-600 hover:bg-blue-700 shadow-blue-100",
  },
};

// Objek untuk menyimpan hasil cache di sisi client agar tidak proses ulang file yang sama
const imageCache: Record<string, { url: string; info: any }> = {};

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [scale, setScale] = useState<Scale>(4);
  const [info, setInfo] = useState<{
    original: string;
    upscaled: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState("Model is processing...");
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Efek untuk menangani pratinjau gambar dan pengecekan resolusi
  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      setWarning(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    // Validasi dimensi gambar untuk memberikan peringatan kepada pengguna
    const img = new Image();
    img.onload = () => {
      if (img.width > 2000 || img.height > 2000) {
        setWarning("Foto memiliki resolusi tinggi (>2000px). Karena diproses di CPU, proses mungkin memakan waktu lebih lama.");
      } else {
        setWarning(null);
      }
    };
    img.src = url;

    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleUpload = async () => {
    if (!file || loading) return;

    // Cek apakah kombinasi file dan skala ini sudah pernah diproses sebelumnya (Client-side Cache)
    const cacheKey = `${file.name}-${file.size}-${scale}`;
    if (imageCache[cacheKey]) {
      setResult(imageCache[cacheKey].url);
      setInfo(imageCache[cacheKey].info);
      return;
    }

    setLoading(true);
    setResult(null);
    setInfo(null);
    setError(null);
    setElapsedTime(0);

    // Mulai timer stopwatch
    timerRef.current = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    // Sequence pesan loading untuk memberikan feedback proses pipeline ke pengguna
    setLoadingMessage("Inisialisasi pipeline Real-ESRGAN...");
    const t1 = setTimeout(() => setLoadingMessage("Menerapkan teknik Tiling (128px)..."), 3000);
    const t2 = setTimeout(() => setLoadingMessage("Model sedang melakukan inferensi pada fragmen citra..."), 20000);
    const t3 = setTimeout(() => setLoadingMessage("Hampir selesai, sedang menggabungkan kembali hasil..."), 60000);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("scale", String(scale));

    try {
      const res = await fetch(
        "https://aryoobp-upscaling-citra.hf.space/upscale",
        {
          method: "POST",
          body: formData,
        },
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Gagal memproses gambar" }));
        throw new Error(err.detail ?? "Gagal memproses gambar");
      }

      // Mengambil data resolusi yang dikirimkan backend melalui custom headers
      const originalSize = res.headers.get("X-Original-Size");
      const upscaledSize = res.headers.get("X-Upscaled-Size");
      const resInfo = {
        original: originalSize ?? "Unknown",
        upscaled: upscaledSize ?? "Unknown"
      };

      const blob = await res.blob();
      const resultUrl = URL.createObjectURL(blob);

      // Simpan hasil ke cache lokal
      imageCache[cacheKey] = { url: resultUrl, info: resInfo };

      setInfo(resInfo);
      setResult(resultUrl);
    } catch (err: any) {
      setError(`${err.message} : Terjadi kesalahan pada sistem`);
    } finally {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const cfg = SCALE_CONFIG[scale];

  return (
    <main className="min-h-screen bg-gray-200 py-12 px-4 flex flex-col items-center">
      {/* Overlay saat loading untuk mencegah interaksi ganda */}
      {loading && (
        <div className="absolute inset-0 z-50 bg-white/30 cursor-wait rounded-3xl" />
      )}
      
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Peningkat Resolusi Gambar
          </h1>
          <p className="text-gray-500 font-medium">Unggah dalam format PNG/JPG/JPEG/WEBP</p>
        </div>

        {/* Pemilih Skala */}
        <div className="flex justify-center gap-4">
          {(Object.keys(SCALE_CONFIG) as unknown as Scale[]).map((s) => (
            <button
              key={s}
              onClick={() => {
                setScale(s);
                setResult(null);
                setInfo(null);
              }}
              className={`
                flex flex-col items-center px-8 py-4 rounded-2xl border-2 transition-all
                ${scale === s
                  ? "border-black bg-white shadow-lg scale-105"
                  : "border-gray-200 bg-white hover:border-gray-400 hover:shadow-md"}
              `}
            >
              <span className="text-2xl font-black text-gray-900">{SCALE_CONFIG[s].label}</span>
              <span className="text-xs text-gray-500 mt-1">{SCALE_CONFIG[s].desc}</span>
            </button>
          ))}
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bagian Input */}
          <div className="space-y-4">
            <label className="relative group flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-black hover:bg-white transition-all overflow-hidden">
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center text-gray-400">
                  <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  <p className="text-sm">Klik untuk mengunggah gambar</p>
                </div>
              )}
              <input
                type="file"
                className="hidden"
                accept="image/png,image/jpeg,image/webp"
                onChange={(e) => {
                  setFile(e.target.files?.[0] ?? null);
                  setResult(null);
                  setInfo(null);
                  setError(null);
                }}
              />
            </label>

            {/* Warning Resolusi */}
            {warning && !loading && (
              <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                ⚠️ <strong>Perhatian:</strong> {warning}
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={loading || !file}
              className={`
                w-full py-4 rounded-xl font-semibold transition-all shadow-lg
                ${loading || !file
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                  : `${cfg.color} text-white active:scale-[0.98]`}
              `}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <span>{loadingMessage}</span>
                  <span className="font-mono bg-white/20 px-2 py-0.5 rounded-lg text-sm tracking-widest">
                    {formatTime(elapsedTime)}
                  </span>
                </span>
              ) : `Upscale ${scale}× Sekarang`}
            </button>

            {/* Metadata Citra */}
            {info && (
              <div className="text-xs text-gray-500 bg-white border border-gray-100 rounded-xl px-4 py-3 space-y-1">
                <div className="flex justify-between border-t border-gray-100 pt-1 mt-1">
                  <span>Waktu Proses:</span>
                  <span className="font-mono font-medium text-gray-700">{formatTime(elapsedTime)}</span>
                </div>
              </div>
            )}

            {error && (
              <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-3">{error}</p>
            )}
          </div>

          {/* Bagian Hasil */}
          <div className="h-64 md:h-full border-2 border-gray-100 rounded-2xl bg-white flex items-center justify-center overflow-hidden relative">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div className="flex flex-col items-center gap-4 w-full p-8">
                  <div className="w-full h-32 bg-gray-100 rounded-lg relative overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    />
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <p className="text-xs text-center text-gray-500 animate-pulse">{loadingMessage}</p>
                    <span className="font-mono text-2xl font-bold text-gray-700 tabular-nums">
                      {formatTime(elapsedTime)}
                    </span>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">Waktu berjalan</p>
                  </div>
                </motion.div>
              ) : result ? (
                <motion.img
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  src={result}
                  alt="Hasil"
                  className="w-full h-full object-cover"
                />
              ) : (
                <p className="text-gray-400 text-sm">Pratinjau hasil akan muncul di sini</p>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Komparasi Detail Sebelum & Sesudah */}
        {result && (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Perbandingan Detail</h3>
              <p className="text-xs text-gray-400 font-mono">KLIK GAMBAR UNTUK ZOOM</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-[10px] font-bold uppercase">Sebelum</span>
                <div className="rounded-2xl border-2 border-gray-100 overflow-hidden cursor-zoom-in">
                  <Zoom>
                    <img src={previewUrl!} alt="Original" className="w-full h-auto" />
                  </Zoom>
                </div>
              </div>

              <div className="space-y-3">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${scale === 2 ? "bg-violet-100 text-violet-600" : "bg-blue-100 text-blue-600"}`}>
                  Sesudah (Real-ESRGAN {scale}×)
                </span>
                <div className={`rounded-2xl border-2 overflow-hidden cursor-zoom-in ${scale === 2 ? "border-violet-100" : "border-blue-100"}`}>
                  <Zoom>
                    <img src={result} alt="Upscaled" className="w-full h-auto" />
                  </Zoom>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <a
                href={result}
                download={`hasil_upscale_${scale}x.png`}
                className={`flex items-center gap-2 text-white px-10 py-3 rounded-full font-bold transition-all hover:scale-105 active:scale-95 ${scale === 2 ? "bg-violet-600 shadow-violet-200" : "bg-blue-600 shadow-blue-200"} shadow-lg`}
              >
                Unduh Citra Hasil
              </a>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}