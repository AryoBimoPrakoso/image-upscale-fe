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
    desc: "Skala pembesaran standar",
    color: "bg-violet-600 hover:bg-violet-700 shadow-violet-100",
  },
  4: {
    label: "4×",
    desc: "Skala pembesaran maksimal",
    color: "bg-blue-600 hover:bg-blue-700 shadow-blue-100",
  },
};

// ─── URL endpoint backend ────────────────────────────────────────────────────
export const API_URL = "https://aryoobp-upscaling-citra.hf.space/upscale";

// ─── Cache sisi klien agar tidak memproses ulang file yang sama ─────────────
export const imageCache: Record<string, { url: string; info: ImageInfo }> = {};

// ─── Sequence pesan loading ──────────────────────────────────────────────────
export const LOADING_MESSAGES = [
  { delay: 0,     text: "Inisialisasi pipeline Real-ESRGAN..." },
  { delay: 3000,  text: "Menerapkan teknik Tiling (128px)..." },
  { delay: 20000, text: "Model sedang melakukan inferensi pada fragmen citra..." },
  { delay: 60000, text: "Hampir selesai, sedang menggabungkan kembali hasil..." },
];
