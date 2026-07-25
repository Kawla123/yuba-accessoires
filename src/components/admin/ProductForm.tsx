"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/slugify";
import { useToastStore } from "@/lib/toast/store";
import { ProductImageUploader, type ProductImageValue } from "./ProductImageUploader";

type Category = { id: string; name_fr: string };

type Initial = {
  nameFr?: string;
  slug?: string;
  priceTnd?: number;
  categoryId?: string | null;
  gender?: "femme" | "homme" | "mixte";
  stockQuantity?: number;
  isActive?: boolean;
  isFeatured?: boolean;
  isNew?: boolean;
  images?: ProductImageValue[];
};

export function ProductForm({
  categories,
  initial,
  action,
}: {
  categories: Category[];
  initial?: Initial;
  action: (formData: FormData) => Promise<{ ok: boolean; error?: string } | void>;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const showToast = useToastStore((s) => s.show);

  const [nameFr, setNameFr] = useState(initial?.nameFr ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initial?.slug));
  const [priceInput, setPriceInput] = useState(
    initial?.priceTnd !== undefined ? (initial.priceTnd / 100).toFixed(2) : "",
  );
  const [images, setImages] = useState<ProductImageValue[]>(initial?.images ?? []);

  function handleNameChange(value: string) {
    setNameFr(value);
    if (!slugTouched) {
      setSlug(slugify(value));
    }
  }

  function handleSlugChange(value: string) {
    setSlugTouched(true);
    setSlug(value);
  }

  async function handleSubmit(formData: FormData) {
    setError(null);

    if (images.length === 0) {
      setError("Ajoute au moins une photo avant d'enregistrer le produit.");
      return;
    }

    const priceTnd = Math.round(parseFloat(priceInput || "0") * 100);
    if (!Number.isFinite(priceTnd) || priceTnd < 0) {
      setError("Prix invalide.");
      return;
    }

    formData.set("nameFr", nameFr);
    formData.set("slug", slug);
    formData.set("priceTnd", String(priceTnd));
    formData.set("images", JSON.stringify(images.map((img) => img.path)));

    setPending(true);
    const result = await action(formData);
    setPending(false);
    if (result && !result.ok) {
      setError(result.error ?? "Erreur.");
    } else if (result && result.ok) {
      // La création redirige déjà côté serveur (voir actions.ts) ; seule
      // la mise à jour reste sur place et doit donc renvoyer elle-même
      // vers la liste, avec un toast pour confirmer l'enregistrement.
      showToast("Produit enregistré ✓");
      router.push("/admin/produits");
    }
  }

  return (
    <form action={handleSubmit} className="mt-8 max-w-xl space-y-5">
      <label className="block">
        <span className="font-sans text-xs tracking-wide text-charcoal/70 uppercase">
          Nom
        </span>
        <input
          name="nameFr"
          value={nameFr}
          onChange={(e) => handleNameChange(e.target.value)}
          required
          className="mt-1.5 w-full border border-border bg-cream px-4 py-2.5 font-sans text-sm text-ink outline-none focus:border-gold"
        />
      </label>

      <label className="block">
        <span className="font-sans text-xs tracking-wide text-charcoal/70 uppercase">
          Slug (URL)
        </span>
        <input
          name="slug"
          value={slug}
          onChange={(e) => handleSlugChange(e.target.value)}
          required
          className="mt-1.5 w-full border border-border bg-cream px-4 py-2.5 font-sans text-sm text-ink outline-none focus:border-gold"
        />
        <span className="mt-1 block font-sans text-[11px] text-charcoal/50">
          Généré automatiquement à partir du nom — modifiable si besoin.
        </span>
      </label>

      <ProductImageUploader value={images} onChange={setImages} />

      <div className="grid grid-cols-2 gap-4">
        <label className="block">
          <span className="font-sans text-xs tracking-wide text-charcoal/70 uppercase">
            Prix (TND)
          </span>
          <input
            type="number"
            step="0.01"
            min={0}
            value={priceInput}
            onChange={(e) => setPriceInput(e.target.value)}
            required
            placeholder="189.00"
            className="mt-1.5 w-full border border-border bg-cream px-4 py-2.5 font-sans text-sm text-ink outline-none focus:border-gold"
          />
        </label>

        <label className="block">
          <span className="font-sans text-xs tracking-wide text-charcoal/70 uppercase">
            Stock
          </span>
          <input
            type="number"
            name="stockQuantity"
            defaultValue={initial?.stockQuantity ?? 0}
            min={0}
            required
            className="mt-1.5 w-full border border-border bg-cream px-4 py-2.5 font-sans text-sm text-ink outline-none focus:border-gold"
          />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <label className="block">
          <span className="font-sans text-xs tracking-wide text-charcoal/70 uppercase">
            Genre
          </span>
          <select
            name="gender"
            defaultValue={initial?.gender ?? "femme"}
            className="mt-1.5 w-full border border-border bg-cream px-4 py-2.5 font-sans text-sm text-ink outline-none focus:border-gold"
          >
            <option value="femme">Femme</option>
            <option value="homme">Homme</option>
            <option value="mixte">Mixte</option>
          </select>
        </label>

        <label className="block">
          <span className="font-sans text-xs tracking-wide text-charcoal/70 uppercase">
            Catégorie
          </span>
          <select
            name="categoryId"
            defaultValue={initial?.categoryId ?? ""}
            className="mt-1.5 w-full border border-border bg-cream px-4 py-2.5 font-sans text-sm text-ink outline-none focus:border-gold"
          >
            <option value="">— Aucune —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name_fr}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex gap-6 font-sans text-sm text-ink">
        <label className="flex items-center gap-2">
          <input type="checkbox" name="isActive" defaultChecked={initial?.isActive ?? false} />
          Actif (visible sur le site)
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="isFeatured" defaultChecked={initial?.isFeatured ?? false} />
          Best-seller
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="isNew" defaultChecked={initial?.isNew ?? false} />
          Nouveauté
        </label>
      </div>

      {error ? <p className="font-sans text-sm text-red-700">{error}</p> : null}

      <button
        type="submit"
        disabled={pending}
        className="bg-ink px-6 py-3 font-sans text-sm text-cream hover:bg-gold disabled:opacity-60"
      >
        {pending ? "Enregistrement…" : "Enregistrer"}
      </button>
    </form>
  );
}
