// The backend supports two plans: free (default) and pro (Stripe).
// PRO_PRICE matches the Starter tier from the PRD ($29/mo).
// If the Stripe price is updated, change this constant only.
export const PRO_PRICE = 29;

export const FREE_FEATURES = [
  "Up to 20 members (when enforced)",
  "Up to 3 programs (when enforced)",
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
