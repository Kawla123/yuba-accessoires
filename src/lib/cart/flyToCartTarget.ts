// Position de l'icône panier du header, enregistrée par CartLink au montage
// et au redimensionnement. Simple référence mutable de module (pas un state
// React) : purement un effet visuel imperatif, pas une donnée d'app.
export const flyToCartTarget: { current: DOMRect | null } = { current: null };
