import { z } from "zod";

export const productFormSchema = z.object({
  nameFr: z.string().trim().min(1, "Nom requis."),
  slug: z
    .string()
    .trim()
    .min(1, "Slug requis.")
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Minuscules et tirets uniquement."),
  priceTnd: z.coerce.number().int().min(0, "Prix invalide."),
  categoryId: z.string().uuid().nullable().optional(),
  gender: z.enum(["femme", "homme", "mixte"]),
  stockQuantity: z.coerce.number().int().min(0),
  isActive: z.coerce.boolean(),
  isFeatured: z.coerce.boolean(),
  isNew: z.coerce.boolean(),
  images: z.array(z.string().min(1)).min(1, "Au moins une photo est requise."),
});

export type ProductFormInput = z.infer<typeof productFormSchema>;
