import { z } from "zod";

export const reviewFormSchema = z.object({
  rating: z.coerce.number().int().min(1, "Choisis une note.").max(5),
  comment: z
    .string()
    .trim()
    .max(1000, "Avis trop long (1000 caractères max).")
    .optional()
    .or(z.literal("")),
});
