// Données de démonstration — à remplacer par les requêtes Supabase réelles
// une fois le catalogue rempli (voir supabase/migrations/).

export type DemoCategory = {
  slug: string;
  name: string;
  swatch: [string, string];
};

export type DemoProduct = {
  slug: string;
  name: string;
  categorySlug: string;
  priceTnd: number; // centimes
  compareAtPriceTnd?: number;
  material: string;
  isNew?: boolean;
  isFeatured?: boolean;
  swatch: [string, string];
};

export const demoCategories: DemoCategory[] = [
  { slug: "bagues", name: "Bagues", swatch: ["#e7d3a1", "#b3893f"] },
  { slug: "colliers", name: "Colliers", swatch: ["#f0e2c4", "#c9a24b"] },
  {
    slug: "boucles-doreilles",
    name: "Boucles d'oreilles",
    swatch: ["#ead9b8", "#a97d38"],
  },
  { slug: "bracelets", name: "Bracelets", swatch: ["#e2cfa0", "#8a6a30"] },
  { slug: "montres", name: "Montres", swatch: ["#d8c9a3", "#7d6a3a"] },
];

export const demoProducts: DemoProduct[] = [
  {
    slug: "bague-houmt-souk",
    name: "Bague Houmt Souk",
    categorySlug: "bagues",
    priceTnd: 18900,
    material: "Argent 925 martelé",
    isFeatured: true,
    swatch: ["#efe1bd", "#b3893f"],
  },
  {
    slug: "collier-porte-bleue",
    name: "Collier Porte Bleue",
    categorySlug: "colliers",
    priceTnd: 24900,
    compareAtPriceTnd: 29900,
    material: "Laiton doré, émail bleu",
    isFeatured: true,
    swatch: ["#e9dcc0", "#8a6a30"],
  },
  {
    slug: "boucles-jasmin",
    name: "Boucles Jasmin",
    categorySlug: "boucles-doreilles",
    priceTnd: 14900,
    material: "Argent 925, perles de verre",
    isNew: true,
    swatch: ["#f2e6cb", "#c9a24b"],
  },
  {
    slug: "bracelet-menzel",
    name: "Bracelet Menzel",
    categorySlug: "bracelets",
    priceTnd: 16900,
    material: "Laiton doré tissé",
    isFeatured: true,
    swatch: ["#e4d2a0", "#a97d38"],
  },
  {
    slug: "bague-lella",
    name: "Bague Lella",
    categorySlug: "bagues",
    priceTnd: 12900,
    material: "Argent 925",
    isNew: true,
    swatch: ["#eee0bd", "#b3893f"],
  },
  {
    slug: "collier-sidi-bou",
    name: "Collier Sidi Bou",
    categorySlug: "colliers",
    priceTnd: 32900,
    material: "Or laminé 18k",
    isFeatured: true,
    isNew: true,
    swatch: ["#f0e4c8", "#c9a24b"],
  },
  {
    slug: "boucles-ghar-el-kebir",
    name: "Boucles Ghar El Kebir",
    categorySlug: "boucles-doreilles",
    priceTnd: 15900,
    isNew: true,
    material: "Argent 925 ajouré",
    swatch: ["#ecdcb6", "#8a6a30"],
  },
  {
    slug: "bracelet-jara",
    name: "Bracelet Jara",
    categorySlug: "bracelets",
    priceTnd: 19900,
    compareAtPriceTnd: 22900,
    material: "Laiton doré, pierre naturelle",
    isFeatured: true,
    isNew: true,
    swatch: ["#e6d5a3", "#a97d38"],
  },
];

export const demoFaq = [
  {
    question: "Livrez-vous partout en Tunisie ?",
    answer:
      "Oui, dans les 24 gouvernorats, avec paiement à la livraison ou par carte via Konnect.",
  },
  {
    question: "Puis-je payer à la livraison ?",
    answer:
      "Oui, c'est notre mode de paiement par défaut. Un appel ou SMS de confirmation précède l'expédition.",
  },
  {
    question: "Quel est le délai de retour ?",
    answer: "14 jours à compter de la réception, pièce non portée et dans son écrin.",
  },
  {
    question: "Les pièces sont-elles vraiment faites à la main ?",
    answer:
      "Oui, chaque pièce est façonnée à l'atelier de Houmt Souk, à Djerba, en séries courtes.",
  },
];
