"use client";

import { useState, useEffect, useRef } from "react";
import { Scale, ImageInfo, LOADING_MESSAGES } from "@/lib/constants";
import { upscaleImage } from "@/lib/upscaleService";

export function useUpscale() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [scale, setScale] = useState<Scale>(4);
  const [info, setInfo] = useState<ImageInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0].text);
  const [elapsedTime, setElapsedTime] = useState(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ─── Buat preview URL dan validasi dimensi gambar ────────────────────────
  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      setWarning(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    const img = new Image();
    img.onload = () => {
      setWarning(
        img.width > 1000 || img.height > 1000
          ? "Foto memiliki resolusi tinggi (>1000px). Karena diproses tanpa adanya GPU, proses mungkin memakan waktu lebih lama."
          : null
      );
    };
    img.src = url;

    return () => URL.revokeObjectURL(url);
  }, [file]);

  // ─── Ganti skala — reset hasil ────────────────────────────────────────────
  const handleScaleChange = (newScale: Scale) => {
    setScale(newScale);
    setResult(null);
    setInfo(null);
  };

  // ─── Ganti file — reset semua state ──────────────────────────────────────
  const handleFileChange = (newFile: File | null) => {
    setFile(newFile);
    setResult(null);
    setInfo(null);
    setError(null);
  };

  // ─── Proses upscaling ─────────────────────────────────────────────────────
  const handleUpload = async () => {
    if (!file || loading) return;

    setLoading(true);
    setResult(null);
    setInfo(null);
    setError(null);
    setElapsedTime(0);
    setLoadingMessage(LOADING_MESSAGES[0].text);

    // Mulai stopwatch
    timerRef.current = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    // Sequence pesan loading
    const timeouts = LOADING_MESSAGES.slice(1).map(({ delay, text }) =>
      setTimeout(() => setLoadingMessage(text), delay)
    );

    try {
      const { url, info: resInfo } = await upscaleImage(file, scale);
      setResult(url);
      setInfo(resInfo);
    } catch (err: any) {
      setError(`${err.message} : Terjadi kesalahan pada sistem`);
    } finally {
      timeouts.forEach(clearTimeout);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setLoading(false);
    }
  };

  return {
    // State
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
    // Actions
    handleFileChange,
    handleScaleChange,
    handleUpload,
  };
}
