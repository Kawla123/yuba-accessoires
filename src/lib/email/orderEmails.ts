import "server-only";
import { Resend } from "resend";
import { formatTND } from "@/lib/format";

function isResendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

const ORDER_STATUS_LABELS: Record<string, string> = {
  pending_confirmation: "en attente de confirmation",
  confirmed: "confirmée",
  shipped: "expédiée",
  delivered: "livrée",
  cancelled: "annulée",
};

const EMAIL_FOOTER = `
  <p style="margin-top:24px;color:#3d2f26">
    — L'équipe Yuba Accessoires<br/>
    Houmt Souk, Djerba, Tunisie — à côté de Meuble Aroua<br/>
    <a href="tel:+21628211326" style="color:#8a6a30">28 211 326</a> ·
    <a href="mailto:khaoula.isims@gmail.com" style="color:#8a6a30">khaoula.isims@gmail.com</a>
  </p>
`;

// Envoi best-effort : si Resend n'est pas configuré (pas de clé API en
// développement), on log et on continue sans jamais faire échouer la
// création de commande à cause d'un email.
async function sendOrderEmail(to: string, subject: string, html: string) {
  if (!isResendConfigured()) {
    console.info(`[email] Resend non configuré — email "${subject}" à ${to} non envoyé.`);
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? "commandes@yuba-bijoux.com",
      to,
      subject,
      html,
    });
  } catch (err) {
    console.error("[email] échec d'envoi Resend:", err);
  }
}

export async function sendOrderConfirmationEmail(params: {
  to: string;
  orderNumber: string;
  customerName: string;
  totalTnd: number;
  paymentMethod: "cod" | "konnect";
}) {
  const paymentLabel =
    params.paymentMethod === "cod"
      ? "Paiement à la livraison"
      : "Paiement en ligne (Konnect)";

  await sendOrderEmail(
    params.to,
    `Confirmation de votre commande ${params.orderNumber}`,
    `<div style="font-family:sans-serif">
      <p>Bonjour ${params.customerName},</p>
      <p>Votre commande <strong>${params.orderNumber}</strong> a bien été enregistrée.</p>
      <p>Montant total : <strong>${formatTND(params.totalTnd)}</strong><br/>
      Mode de paiement : ${paymentLabel}</p>
      <p>Nous vous contacterons pour confirmer la livraison.</p>
      ${EMAIL_FOOTER}
    </div>`,
  );
}

export async function sendOrderStatusUpdateEmail(params: {
  to: string;
  orderNumber: string;
  customerName: string;
  orderStatus: string;
}) {
  const label = ORDER_STATUS_LABELS[params.orderStatus] ?? params.orderStatus;

  await sendOrderEmail(
    params.to,
    `Votre commande ${params.orderNumber} est maintenant ${label}`,
    `<div style="font-family:sans-serif">
      <p>Bonjour ${params.customerName},</p>
      <p>Votre commande <strong>${params.orderNumber}</strong> est maintenant : <strong>${label}</strong>.</p>
      ${EMAIL_FOOTER}
    </div>`,
  );
}
