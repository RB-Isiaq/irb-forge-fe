---
name: IRB Forge Frontend Architecture
description: Layered architecture, folder structure, token strategy, Tailwind v4 config, Next.js 16 gotchas
type: project
---

Multi-tenant SaaS frontend for IRB Forge. Next.js 16.2.4 (App Router), React 19, Tailwind v4, TypeScript.
Deadline: May 31, 2026. Backend built on weekends (NestJS).

## Architecture — 6 strict layers, no skipping

```
Layer 1 — types/
  Pure TypeScript interfaces. No logic, no imports from other layers.

Layer 2 — lib/api/
  Pure HTTP functions (Axios). Returns typed data. No state, no side effects.
  client.ts: Axios instance + tokenStore + silent 401 refresh interceptor.
  error.ts:  extractApiError() — single place to unwrap the API error envelope.

Layer 3 — lib/validations/
  Zod schemas only. Imported by hooks and feature components. Never in pages.
  auth.ts: registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema
  org.ts:  createOrgSchema, updateOrgSchema, sendInvitationSchema

Layer 4 — lib/query-keys.ts  +  hooks/queries/
  Query key factory: queryKeys.orgs.all(), queryKeys.members.list(slug), etc.
  Query hooks own: queryKey, queryFn, cache invalidation, toast errors.
  Pages NEVER call useQuery/useMutation directly.
  use-orgs.ts:        useOrgs, useOrg, useCreateOrg, useUpdateOrg, useDeleteOrg
  use-members.ts:     useMembers, useUpdateMemberRole, useRemoveMember, useLeaveOrg
  use-invitations.ts: useOrgInvitations, useMyInvitations, useInvitationPreview,
                      useSendInvitation, useCancelInvitation, useAcceptInvitation, useDeclineInvitation

Layer 5 — components/ui/  +  components/features/
  ui/: stateless primitives (Button, Input, Textarea, Label, Card, Badge, Spinner, Avatar, FormField)
  features/org/: composed components that import query hooks + ui primitives.
    OrgGrid, CreateOrgForm, MembersList, InvitationsTable, InviteMemberForm,
    OrgSettingsForm, InvitationsInbox

Layer 6 — app/
  Thin shells: metadata + heading + one feature component. Nothing else.
  No useQuery, no useMutation, no z.object(), no toast calls.
```

## Key patterns

**Proxy (not middleware):** Next.js 16 renamed middleware.ts → proxy.ts, export `proxy()` not `middleware()`.

**Auth token strategy:** accessToken in Zustand (memory). refreshToken in localStorage (key: irb_refresh_token).
Session hint cookie (irb_session) set client-side by AuthProvider so proxy.ts can redirect unauthenticated users.

**Tailwind v4:** Config is in globals.css via @theme blocks, NOT tailwind.config.js.
Use canonical classes: max-w-140 not max-w-[560px], min-h-75 not min-h-[300px].

**useSearchParams must be wrapped in <Suspense>** in Next.js 16 — enforced at build time.
Pattern: inner component uses the hook, outer page default export wraps it.

**Zod + react-hook-form:** Never use .default() on schema fields — set defaultValues in useForm instead.
The .default() modifier creates an optional input type that conflicts with react-hook-form's SubmitHandler.

## API

NEXT_PUBLIC_API_URL in .env.local → defaults to http://localhost:3000/api
