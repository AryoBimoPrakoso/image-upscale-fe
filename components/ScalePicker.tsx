import { Scale, SCALE_CONFIG } from "@/lib/constants";

type Props = {
  scale: Scale;
  onScaleChange: (s: Scale) => void;
  disabled?: boolean;
};

/**
 * Komponen pemilih skala pembesaran (×2 / ×4).
 * Menampilkan dua tombol yang dapat dipilih pengguna.
 */
export default function ScalePicker({ scale, onScaleChange, disabled }: Props) {
  return (
    <div className="flex justify-center gap-4">
      {(Object.keys(SCALE_CONFIG) as unknown as Scale[]).map((s) => (
        <button
          key={s}
          onClick={() => !disabled && onScaleChange(s)}
          disabled={disabled}
          className={`
            flex flex-col items-center px-8 py-4 rounded-2xl border-2 transition-all w-50
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
            ${scale === s
              ? "border-black bg-white shadow-lg scale-105"
              : "border-gray-200 bg-white hover:border-gray-400 hover:shadow-md"}
          `}
        >
          <span className="text-2xl font-black text-gray-900">
            {SCALE_CONFIG[s].label}
          </span>
          <span className="text-xs text-gray-500 mt-1">
            {SCALE_CONFIG[s].desc}
          </span>
        </button>
      ))}
    </div>
  );
}
