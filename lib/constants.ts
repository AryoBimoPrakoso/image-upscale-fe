// ─── Tipe data untuk skala pembesaran ───────────────────────────────────────
export type Scale = 2 | 4;

export type ImageInfo = {
  original: string;
  upscaled: string;
};

// ─── Konfigurasi tampilan tiap opsi skala ───────────────────────────────────
export const SCALE_CONFIG: Record<Scale, { label: string; desc: string; color: string }> = {
  2: {
    label: "2×",
    desc: "Peningkatan detail yang lebih seimbang dan efisien.",
    color: "bg-violet-600 hover:bg-violet-700 shadow-violet-100",
  },
  4: {
    label: "4×",
    desc: "Peningkatan detail lebih agresif untuk citra tertentu.",
    color: "bg-blue-600 hover:bg-blue-700 shadow-blue-100",
  },
};

// ─── URL endpoint backend ────────────────────────────────────────────────────
export const API_URL = "https://aryoobp-upscaling-citra.hf.space/upscale";

// ─── Cache sisi klien agar tidak memproses ulang file yang sama ─────────────
export const imageCache: Record<string, { url: string; info: ImageInfo }> = {};

// ─── Sequence pesan loading ──────────────────────────────────────────────────
export const LOADING_MESSAGES = [
  { delay: 0,     text: "Menyiapkan proses peningkatan kualitas gambar..." },
  { delay: 10000,  text: "Menganalisis detail dan struktur gambar..." },
  { delay: 30000, text: "Sedang meningkatkan detail gambar..." },
  { delay: 60000, text: "Hampir selesai, sedang menyiapkan hasil akhir..." },
  { delay: 18000, text: "Proses masih berjalan, sedang menyempurnakan detail gambar..." },
];
