// Repli uniquement : utilisé quand un produit/catégorie n'a pas encore de
// photo réelle en base, ou si la séquence de frames du hero ne charge pas.
export function placeholder(seed: string, width: number, height: number): string {
  return `https://picsum.photos/seed/yuba-${seed}/${width}/${height}`;
}
