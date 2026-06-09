import { Scale, SCALE_CONFIG } from "@/lib/constants";
import { formatTime } from "@/lib/formatTime";
import { ImageInfo } from "@/lib/constants";

type Props = {
  previewUrl: string | null;
  loading: boolean;
  scale: Scale | null;
  warning: string | null;
  error: string | null;
  info: ImageInfo | null;
  loadingMessage: string;
  elapsedTime: number;
  onFileChange: (file: File | null) => void;
  onUpload: () => void;
};

/**
 * Komponen panel kiri — area upload citra, pilihan file,
 * tombol proses, peringatan resolusi, dan pesan error.
 */
export default function ImageUploader({
  previewUrl,
  loading,
  scale,
  warning,
  error,
  info,
  loadingMessage,
  elapsedTime,
  onFileChange,
  onUpload,
}: Props) {
  const cfgColor = scale ? SCALE_CONFIG[scale].color : "";

  return (
    <div className="space-y-4">
      {/* Area upload */}
      <label
        className={`
          relative group flex flex-col items-center justify-center
          w-full h-64 border-2 border-dashed border-gray-300
          rounded-2xl overflow-hidden transition-all
          ${
            loading
              ? "cursor-not-allowed opacity-70"
              : "cursor-pointer hover:border-black hover:bg-white"
          }
        `}
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center text-gray-400">
            <svg
              className="w-10 h-10 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            <p className="text-sm">Klik untuk mengunggah gambar</p>
          </div>
        )}
        <input
          type="file"
          className="hidden"
          disabled={loading}
          accept="image/png,image/jpeg,image/webp"
          onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
        />
      </label>

      {/* Peringatan resolusi tinggi */}
      {warning && !loading && (
        <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          ⚠️ <strong>Perhatian:</strong> {warning}
        </div>
      )}

  
      {/* Tombol proses */}
      <button
        onClick={onUpload}
        // Tombol otomatis disabled jika loading, gambar belum diunggah, atau skala belum dipilih
        disabled={loading || !previewUrl || !scale} 
        className={`
          w-full py-4 rounded-xl font-semibold transition-all shadow-lg
          ${
            loading || !previewUrl || !scale
              ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
              : `${cfgColor} text-white active:scale-[0.98]`
          }
        `}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-3">
            <span>{loadingMessage}</span>
            <span className="font-mono bg-white/20 px-2 py-0.5 rounded-lg text-sm tracking-widest">
              {formatTime(elapsedTime)}
            </span>
          </span>
        ) : !previewUrl ? (
          "Unggah Gambar LR (Low Resolution) dan Pilih ukuran skala pembesaran"
        ) : !scale ? (
          // Teks peringatan tambahan jika gambar sudah ada tetapi skala belum dipilih
          "Silakan pilih skala pembesaran terlebih dahulu"
        ) : (
          `Upscale ${scale}× Sekarang`
        )}
      </button>

      {/* Info waktu proses */}
      {info && (
        <div className="text-xs text-gray-500 bg-white border border-gray-100 rounded-xl px-4 py-3 space-y-1">
          <div className="flex justify-between border-t border-gray-100 pt-1 mt-1">
            <span>Waktu Proses:</span>
            <span className="font-mono font-medium text-gray-700">
              {formatTime(elapsedTime)}
            </span>
          </div>
        </div>
      )}

      {/* Pesan error */}
      {error && (
        <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-3">
          {error}
        </p>
      )}
    </div>
  );
}
