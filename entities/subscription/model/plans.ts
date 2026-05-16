import type { Plan, PlanId } from "./types";

export const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    limits: { orgs: 1, members: 10, programs: 1 },
    features: ["1 organization", "Up to 10 members", "1 program", "Announcements"],
  },
  {
    id: "starter",
    name: "Starter",
    price: 29,
    limits: { orgs: 1, members: 50, programs: 5 },
    features: [
      "1 organization",
      "Up to 50 members",
      "5 programs",
      "Email invitations",
      "Priority email support",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    price: 79,
    limits: { orgs: 3, members: 200, programs: null },
    features: [
      "3 organizations",
      "Up to 200 members",
      "Unlimited programs",
      "Everything in Starter",
      "Analytics (coming soon)",
    ],
    highlight: true,
  },
  {
    id: "scale",
    name: "Scale",
    price: 199,
    limits: { orgs: null, members: null, programs: null },
    features: [
      "Unlimited organizations",
      "Unlimited members",
      "Unlimited programs",
      "Priority support",
      "Custom domain (coming soon)",
    ],
  },
];

export function getPlan(id: PlanId): Plan {
  return PLANS.find((p) => p.id === id) ?? PLANS[0];
}
