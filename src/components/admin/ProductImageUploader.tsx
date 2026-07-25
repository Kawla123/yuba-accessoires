"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

export type ProductImageValue = { path: string; url: string };

const MAX_WIDTH = 1600;

async function resizeImage(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_WIDTH / bitmap.width);
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Contexte canvas indisponible.");
  ctx.drawImage(bitmap, 0, 0, width, height);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Échec de compression."))),
      "image/jpeg",
      0.82,
    );
  });
}

export function ProductImageUploader({
  value,
  onChange,
}: {
  value: ProductImageValue[];
  onChange: (next: ProductImageValue[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  async function handleFiles(files: FileList | File[]) {
    const imageFiles = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (imageFiles.length === 0) return;

    setUploading(true);
    setError(null);
    const uploaded: ProductImageValue[] = [];

    for (const file of imageFiles) {
      try {
        const blob = await resizeImage(file);
        const formData = new FormData();
        formData.append("file", blob, "photo.jpg");
        const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Échec de l'upload.");
        uploaded.push({ path: data.path, url: data.url });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Échec de l'upload.");
      }
    }

    if (uploaded.length > 0) {
      onChange([...value, ...uploaded]);
    }
    setUploading(false);
  }

  function handleRemove(path: string) {
    onChange(value.filter((v) => v.path !== path));
    fetch(`/api/admin/upload?path=${encodeURIComponent(path)}`, { method: "DELETE" }).catch(() => {});
  }

  function handleMove(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= value.length) return;
    const next = [...value];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  return (
    <div>
      <span className="font-sans text-xs tracking-wide text-charcoal/70 uppercase">
        Photos {value.length === 0 ? "(au moins 1 requise)" : ""}
      </span>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={`mt-1.5 border-2 border-dashed px-6 py-8 text-center transition-colors ${
          dragOver ? "border-gold bg-gold/5" : "border-border"
        }`}
      >
        <Upload className="mx-auto h-6 w-6 text-charcoal/40" />
        <p className="mt-2 font-sans text-sm text-charcoal/60">
          Glisse des photos ici, ou
        </p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="mt-2 inline-flex items-center gap-2 border border-ink px-4 py-2 font-sans text-xs text-ink hover:border-gold hover:text-gold disabled:opacity-50"
        >
          {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
          {uploading ? "Envoi…" : "Choisir un fichier"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
        <p className="mt-2 font-sans text-[11px] text-charcoal/40">
          1 photo minimum obligatoire pour enregistrer. Ajoute une 2ᵉ photo (produit porté) pour
          activer le fondu au survol sur le site.
        </p>
      </div>

      {error ? <p className="mt-2 font-sans text-xs text-red-700">{error}</p> : null}

      {value.length > 0 ? (
        <div className="mt-4 grid grid-cols-4 gap-3">
          {value.map((img, i) => (
            <div key={img.path} className="group relative aspect-square bg-cream-2">
              <Image src={img.url} alt="" fill sizes="150px" className="object-cover" />
              <button
                type="button"
                onClick={() => handleRemove(img.path)}
                aria-label="Supprimer"
                className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center bg-ink/80 text-cream"
              >
                <X className="h-3.5 w-3.5" />
              </button>
              <div className="absolute inset-x-0 bottom-1 flex justify-center gap-1">
                <button
                  type="button"
                  onClick={() => handleMove(i, -1)}
                  disabled={i === 0}
                  aria-label="Déplacer avant"
                  className="flex h-6 w-6 items-center justify-center bg-cream/90 text-ink disabled:opacity-30"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleMove(i, 1)}
                  disabled={i === value.length - 1}
                  aria-label="Déplacer après"
                  className="flex h-6 w-6 items-center justify-center bg-cream/90 text-ink disabled:opacity-30"
                >
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
              {i === 0 ? (
                <span className="absolute top-1 left-1 bg-gold px-1.5 py-0.5 font-sans text-[10px] text-ink">
                  Packshot
                </span>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
