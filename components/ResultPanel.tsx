import { motion, AnimatePresence } from "framer-motion";
import { formatTime } from "@/lib/formatTime";

type Props = {
  loading: boolean;
  result: string | null;
  loadingMessage: string;
  elapsedTime: number;
};

/**
 * Komponen panel kanan — menampilkan state loading (skeleton + stopwatch)
 * atau citra hasil upscaling setelah proses selesai.
 */
export default function ResultPanel({ loading, result, loadingMessage, elapsedTime }: Props) {
  return (
    <div className="h-64 md:h-full border-2 border-gray-100 rounded-2xl bg-white flex items-center justify-center overflow-hidden relative">
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            className="flex flex-col items-center gap-4 w-full p-8"
          >
            {/* Skeleton bar */}
            <div className="w-full h-32 bg-gray-100 rounded-lg relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              />
            </div>

            {/* Pesan dan stopwatch */}
            <div className="flex flex-col items-center gap-1">
              <p className="text-xs text-center text-gray-500 animate-pulse">
                {loadingMessage}
              </p>
              <span className="font-mono text-2xl font-bold text-gray-700 tabular-nums">
                {formatTime(elapsedTime)}
              </span>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                Waktu berjalan
              </p>
            </div>
          </motion.div>
        ) : result ? (
          <motion.img
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            src={result}
            alt="Hasil upscaling"
            className="w-full h-full object-cover"
          />
        ) : (
          <motion.p
            key="empty"
            className="text-gray-400 text-sm"
          >
            Pratinjau hasil akan muncul di sini
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
