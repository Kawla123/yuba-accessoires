import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email("Adresse email invalide."),
  password: z.string().min(1, "Mot de passe requis."),
});

export const signupSchema = z.object({
  firstName: z.string().trim().min(1, "Prénom requis."),
  lastName: z.string().trim().min(1, "Nom requis."),
  email: z.string().trim().email("Adresse email invalide."),
  password: z
    .string()
    .min(8, "8 caractères minimum.")
    .regex(/[a-zA-Z]/, "Au moins une lettre.")
    .regex(/[0-9]/, "Au moins un chiffre."),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Adresse email invalide."),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "8 caractères minimum.")
      .regex(/[a-zA-Z]/, "Au moins une lettre.")
      .regex(/[0-9]/, "Au moins un chiffre."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
