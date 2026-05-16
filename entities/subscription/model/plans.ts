// Pro plan pricing — NGN, billed monthly via Stripe.
// Stripe stores amounts in kobo (smallest unit): ₦30,000 = 3,000,000 kobo.
export const PRO_PRICE = 30_000; // current launch offer price (NGN)
export const PRO_ORIGINAL_PRICE = 45_000; // crossed-out original price (NGN)
export const PRO_DISCOUNT_PCT = Math.round((1 - PRO_PRICE / PRO_ORIGINAL_PRICE) * 100); // 33
export const PRO_CURRENCY_SYMBOL = "₦";

export const FREE_FEATURES = [
  "Up to 20 members",
  "Up to 3 programs",
  "Announcements & email invitations",
  "Basic member management",
];

export const PRO_FEATURES = [
  "Unlimited members",
  "Unlimited programs",
  "Everything in Free",
  "Priority support",
  "Analytics (coming soon)",
];

export function formatNaira(amount: number): string {
  return `${PRO_CURRENCY_SYMBOL}${amount.toLocaleString("en-NG")}`;
}

/** Convert Stripe kobo amount → display string (e.g. 3000000 → "₦30,000") */
export function formatPaymentAmount(amountInKobo: number, currency: string): string {
  const naira = amountInKobo / 100;
  if (currency.toUpperCase() === "NGN") {
    return `${PRO_CURRENCY_SYMBOL}${naira.toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;
  }
  return `$${naira.toFixed(2)}`;
}
