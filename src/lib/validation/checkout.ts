import { z } from "zod";

export const GOVERNORATES = [
  "Ariana",
  "Béja",
  "Ben Arous",
  "Bizerte",
  "Gabès",
  "Gafsa",
  "Jendouba",
  "Kairouan",
  "Kasserine",
  "Kébili",
  "Kef",
  "Mahdia",
  "Manouba",
  "Médenine",
  "Monastir",
  "Nabeul",
  "Sfax",
  "Sidi Bouzid",
  "Siliana",
  "Sousse",
  "Tataouine",
  "Tozeur",
  "Tunis",
  "Zaghouan",
] as const;

export const shippingAddressSchema = z.object({
  customerName: z.string().trim().min(2, "Nom complet requis."),
  customerPhone: z
    .string()
    .trim()
    .regex(/^[0-9+\s]{8,}$/, "Numéro de téléphone invalide."),
  customerEmail: z
    .string()
    .trim()
    .email("Adresse email invalide.")
    .optional()
    .or(z.literal("")),
  shippingAddress: z.string().trim().min(5, "Adresse requise."),
  city: z.string().trim().min(1, "Ville requise."),
  governorate: z.enum(GOVERNORATES, {
    message: "Gouvernorat requis.",
  }),
});

export type ShippingAddressInput = z.infer<typeof shippingAddressSchema>;

export const paymentMethodSchema = z.enum(["cod", "konnect"]);
