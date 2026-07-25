// Les prix sont stockés en centimes (integer). Taux EUR fixe et approximatif
// en attendant un taux de change réel branché en phase 5.
const TND_PER_EUR = 3.4;

export function tndFromCents(cents: number): number {
  return cents / 100;
}

export function formatTND(cents: number): string {
  const value = tndFromCents(cents);
  return `${value.toLocaleString("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} TND`;
}

export function formatEURFromCents(cents: number): string {
  const eur = tndFromCents(cents) / TND_PER_EUR;
  return `≈ ${eur.toLocaleString("fr-FR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })} €`;
}
