import "server-only";

// Intégration Konnect (konnect.network), la passerelle agréée par la
// Banque Centrale de Tunisie — Stripe/PayPal ne fonctionnent pas pour un
// marchand tunisien, Konnect est la seule option pour le paiement en ligne.
// Doc : https://developers.konnect.network

const BASE_URL =
  process.env.KONNECT_BASE_URL ?? "https://api.sandbox.konnect.network/api/v2";

export function isKonnectConfigured(): boolean {
  return Boolean(process.env.KONNECT_API_KEY && process.env.KONNECT_WALLET_ID);
}

type InitPaymentParams = {
  amountMillimes: number; // montant en millimes (1 TND = 1000 millimes)
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  successUrl: string;
  failUrl: string;
  webhookUrl: string;
};

type InitPaymentResponse = {
  payUrl: string;
  paymentRef: string;
};

export async function createKonnectPayment(
  params: InitPaymentParams,
): Promise<InitPaymentResponse> {
  if (!isKonnectConfigured()) {
    throw new Error(
      "Konnect n'est pas configuré (KONNECT_API_KEY / KONNECT_WALLET_ID manquants).",
    );
  }

  const [firstName, ...rest] = params.customerName.trim().split(" ");

  const response = await fetch(`${BASE_URL}/payments/init-payment`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": process.env.KONNECT_API_KEY!,
    },
    body: JSON.stringify({
      receiverWalletId: process.env.KONNECT_WALLET_ID,
      token: "TND",
      amount: params.amountMillimes,
      type: "immediate",
      description: `Commande Yuba ${params.orderId}`,
      acceptedPaymentMethods: ["wallet", "bank_card", "e-DINAR"],
      lifespan: 30,
      checkoutForm: false,
      addPaymentFeesToAmount: false,
      firstName: firstName || params.customerName,
      lastName: rest.join(" ") || "-",
      phoneNumber: params.customerPhone,
      email: params.customerEmail,
      orderId: params.orderId,
      webhook: params.webhookUrl,
      successUrl: params.successUrl,
      failUrl: params.failUrl,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Konnect init-payment a échoué (${response.status}): ${body}`);
  }

  const data = (await response.json()) as {
    payUrl: string;
    paymentRef: string;
  };

  return { payUrl: data.payUrl, paymentRef: data.paymentRef };
}

export type KonnectPaymentStatus =
  | "pending"
  | "completed"
  | "failed"
  | "expired";

// Ne jamais faire confiance au seul appel webhook (Konnect n'envoie pas de
// signature HMAC comme Stripe) : on revérifie toujours le statut auprès de
// l'API Konnect avec notre clé secrète avant de mettre à jour la commande.
export async function getKonnectPayment(paymentRef: string): Promise<{
  status: KonnectPaymentStatus;
  orderId: string | null;
}> {
  const response = await fetch(`${BASE_URL}/payments/${paymentRef}`, {
    headers: { "x-api-key": process.env.KONNECT_API_KEY! },
  });

  if (!response.ok) {
    throw new Error(`Konnect get-payment a échoué (${response.status})`);
  }

  const data = (await response.json()) as {
    payment: { status: KonnectPaymentStatus; orderId?: string };
  };

  return {
    status: data.payment.status,
    orderId: data.payment.orderId ?? null,
  };
}
