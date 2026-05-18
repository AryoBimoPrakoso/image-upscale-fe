import { motion } from "framer-motion";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { Scale } from "@/lib/constants";

type Props = {
  previewUrl: string;
  result: string;
  scale: Scale;
};

/**
 * Komponen perbandingan before-after — ditampilkan setelah
 * hasil upscaling tersedia. Menyediakan tampilan zoom dan tombol unduh.
 */
export default function ComparisonView({ previewUrl, result, scale }: Props) {
  const isViolet = scale === 2;
  const accentClass = isViolet
    ? { badge: "bg-violet-100 text-violet-600", border: "border-violet-100", btn: "bg-violet-600 shadow-violet-200" }
    : { badge: "bg-blue-100 text-blue-600", border: "border-blue-100", btn: "bg-blue-600 shadow-blue-200" };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">Perbandingan Detail</h3>
        <p className="text-xs text-gray-400 font-mono">KLIK GAMBAR UNTUK ZOOM</p>
      </div>

      {/* Grid before-after */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Sebelum */}
        <div className="space-y-3">
          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-[10px] font-bold uppercase">
            Sebelum
          </span>
          <div className="rounded-2xl border-2 border-gray-100 overflow-hidden cursor-zoom-in">
            <Zoom>
              <img src={previewUrl} alt="Citra asli" className="w-full h-auto" />
            </Zoom>
          </div>
        </div>

        {/* Sesudah */}
        <div className="space-y-3">
          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${accentClass.badge}`}>
            Sesudah (Real-ESRGAN {scale}×)
          </span>
          <div className={`rounded-2xl border-2 overflow-hidden cursor-zoom-in ${accentClass.border}`}>
            <Zoom>
              <img src={result} alt={`Citra hasil upscaling ${scale}×`} className="w-full h-auto" />
            </Zoom>
          </div>
        </div>
      </div>

      {/* Tombol unduh */}
      <div className="mt-8 flex justify-center">
        <a
          href={result}
          download={`hasil_upscale_${scale}x.png`}
          className={`flex items-center gap-2 text-white px-10 py-3 rounded-full font-bold transition-all hover:scale-105 active:scale-95 ${accentClass.btn} shadow-lg`}
        >
          Unduh Citra Hasil
        </a>
      </div>
    </motion.div>
  );
}
