/**
 * Centralized query key factory.
 *
 * Every useQuery / useMutation that references a cache key must import
 * from here. This is the single source of truth — no string literals
 * scattered across files, no cache-invalidation guessing games.
 *
 * Convention: keys are tuples so React Query can do partial-match
 * invalidation (e.g. invalidate all ["orgs"] at once).
 */

export const queryKeys = {
  /* ─── Auth ─────────────────────────────────────── */
  me: () => ["me"] as const,

  /* ─── Organizations ─────────────────────────────── */
  orgs: {
    all: () => ["orgs"] as const,
    detail: (slug: string) => ["orgs", slug] as const,
  },

  /* ─── Members ────────────────────────────────────── */
  members: {
    list: (slug: string) => ["orgs", slug, "members"] as const,
    me: (slug: string) => ["orgs", slug, "members", "me"] as const,
  },

  /* ─── Invitations ────────────────────────────────── */
  invitations: {
    byOrg: (slug: string) => ["orgs", slug, "invitations"] as const,
    mine: () => ["invitations", "me"] as const,
    preview: (token: string) => ["invitations", "preview", token] as const,
  },

  /* ─── Programs ───────────────────────────────────── */
  programs: {
    list: (slug: string) => ["orgs", slug, "programs"] as const,
    detail: (slug: string, id: string) => ["orgs", slug, "programs", id] as const,
  },

  /* ─── Enrollments ────────────────────────────────── */
  enrollments: {
    byProgram: (slug: string, programId: string) =>
      ["orgs", slug, "programs", programId, "enrollments"] as const,
    mine: (slug: string, programId: string) =>
      ["orgs", slug, "programs", programId, "enrollments", "me"] as const,
    myInOrg: (slug: string) => ["orgs", slug, "enrollments"] as const,
  },

  /* ─── Messages ───────────────────────────────────── */
  messages: {
    byOrg: (slug: string) => ["orgs", slug, "messages"] as const,
  },

  /* ─── Subscription + Payments ───────────────────── */
  subscription: {
    me: () => ["subscription", "me"] as const,
    payments: () => ["subscription", "payments"] as const,
  },
} as const;
