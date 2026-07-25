// Interpolation linéaire par morceaux, avec clamp explicite aux bornes.
// Utilisé pour dériver opacité/position depuis la progression de scroll :
// on contrôle nous-mêmes le clamp plutôt que de dépendre du comportement
// par défaut de useTransform (tableaux input/output) sur cette version de
// Motion, qui s'est révélé incohérent entre la valeur brute (.get()) et le
// style effectivement appliqué au DOM au-delà de la dernière borne.
export function mapRange(
  value: number,
  stops: readonly number[],
  outputs: readonly number[],
): number {
  if (value <= stops[0]) return outputs[0];
  const last = stops.length - 1;
  if (value >= stops[last]) return outputs[last];

  for (let i = 0; i < last; i++) {
    if (value >= stops[i] && value <= stops[i + 1]) {
      const t = (value - stops[i]) / (stops[i + 1] - stops[i]);
      return outputs[i] + t * (outputs[i + 1] - outputs[i]);
    }
  }

  return outputs[last];
}
