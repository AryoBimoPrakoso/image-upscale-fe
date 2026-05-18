import { API_URL, imageCache, ImageInfo, Scale } from "./constants";

export type UpscaleResult = {
  url: string;
  info: ImageInfo;
};

/**
 * Mengirim permintaan upscaling ke backend FastAPI.
 * Mengembalikan URL blob citra hasil dan informasi resolusi.
 * Jika kombinasi file+scale sudah pernah diproses, dikembalikan dari cache.
 */
export async function upscaleImage(
  file: File,
  scale: Scale,
): Promise<UpscaleResult> {
  // Cek cache terlebih dahulu
  const cacheKey = `${file.name}-${file.size}-${scale}`;
  if (imageCache[cacheKey]) {
    return imageCache[cacheKey];
  }

  // Bangun FormData dan kirim ke endpoint backend
  const formData = new FormData();
  formData.append("file", file);
  formData.append("scale", String(scale));

  const res = await fetch(API_URL, { method: "POST", body: formData });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Gagal memproses gambar" }));
    throw new Error(err.detail ?? "Gagal memproses gambar");
  }

  // Ambil informasi resolusi dari custom response headers
  const info: ImageInfo = {
    original: res.headers.get("X-Original-Size") ?? "Unknown",
    upscaled: res.headers.get("X-Upscaled-Size") ?? "Unknown",
  };

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);

  // Simpan ke cache
  imageCache[cacheKey] = { url, info };

  return { url, info };
}
