# IRB Forge — Frontend

> **Build. Connect. Scale.**
> The web client for IRB Forge — a multi-tenant SaaS platform for mentorship communities.

---

## Stack

| Concern       | Technology                            |
| ------------- | ------------------------------------- |
| Framework     | Next.js 16 (App Router, Turbopack)    |
| Language      | TypeScript                            |
| Styling       | Tailwind CSS v4                       |
| Server state  | TanStack Query v5                     |
| Client state  | Zustand                               |
| Forms         | React Hook Form + Zod                 |
| HTTP          | Axios (silent 401 token refresh)      |
| Auth          | JWT (in-memory) + Google OAuth (GIS)  |
| Notifications | Sonner                                |
| Icons         | Lucide React                          |
| Font          | Inter (brand) · JetBrains Mono (code) |
| Testing       | Vitest + React Testing Library        |

---

## Architecture — Feature-Sliced Design (FSD)

This project strictly follows [Feature-Sliced Design](https://feature-sliced.design).

FSD organizes code into **layers**, each divided into **slices** (domain groupings), each divided into **segments** (`ui/`, `model/`, `api/`).

### Layer hierarchy

```
app/        ← Next.js routing + global providers (entry points only)
widgets/    ← Self-contained UI blocks that compose entities + features
features/   ← Single user actions (a form, a button with a mutation)
entities/   ← Business objects: types, API calls, React Query hooks
shared/     ← Non-domain: design system, HTTP client, utilities
```

**The rule: a layer may only import from layers below it. Never upward, never sideways between slices.**

---

## Layers in detail

### `app/` — Routing + providers

- Next.js App Router file-based routing
- `_providers/` — `QueryClientProvider`, `AuthProvider`, `GoogleOAuthProvider`, `Toaster`
- Pages export `metadata` and render **one widget**. No `useQuery`, no schemas.

### `widgets/` — Composed page sections

| Widget               | Responsibility                                                                                     |
| -------------------- | -------------------------------------------------------------------------------------------------- |
| `landing-page/`      | Public marketing page (`/`) — unauthenticated                                                      |
| `sidebar/`           | App navigation, pending invitations badge, logout                                                  |
| `dashboard-stats/`   | Org count + pending invitations count (live data)                                                  |
| `org-grid/`          | Organization card list                                                                             |
| `org-overview/`      | Org home tab — stats, my programs, recent announcements, quick actions                             |
| `org-members/`       | Members table with role badges, role change + remove (owner/admin)                                 |
| `org-invitations/`   | Invitations table — send, cancel, resend (owner/admin)                                             |
| `org-programs/`      | Programs list — create form (managers), enroll status (members)                                    |
| `program-detail/`    | Program header, enroll/drop (members), roster + mark-complete (managers)                           |
| `org-announcements/` | Announcements feed + compose form (owner/admin/mentor)                                             |
| `org-channels/`      | Channel chat — sidebar list, markdown message feed with infinite-scroll history, member management |
| `billing-overview/`  | Plan + payment history, Stripe checkout, cancel subscription (owner)                               |
| `my-enrollments/`    | Member's enrolled programs with status                                                             |
| `org-settings/`      | Settings form + danger zone (owner-only delete)                                                    |
| `invitations-inbox/` | Personal invitation inbox (ID-based accept/decline)                                                |
| `user-settings/`     | Profile update + change password + Google account info                                             |
| `unverified-banner/` | Email verification reminder                                                                        |

### `features/` — User interactions

| Feature                       | Responsibility                                                                   |
| ----------------------------- | -------------------------------------------------------------------------------- |
| `auth/login/`                 | Login form (email + Google)                                                      |
| `auth/register/`              | Registration form (email + Google)                                               |
| `auth/verify-email/`          | OTP verification with auto-submit                                                |
| `auth/forgot-password/`       | Forgot password form                                                             |
| `auth/reset-password/`        | Reset password form                                                              |
| `auth/google-sign-in/`        | Google OAuth button (idToken flow)                                               |
| `org/create-org/`             | Create organization form                                                         |
| `org/invite-member/`          | Invite member form                                                               |
| `org/create-program/`         | Create program form                                                              |
| `org/update-program/`         | Edit program form (pre-populated)                                                |
| `org/send-message/`           | Announcement compose form                                                        |
| `org/create-channel/`         | Create channel form                                                              |
| `org/send-channel-message/`   | Channel message compose form (markdown toolbar + preview, same as announcements) |
| `org/manage-channel-members/` | Add/remove channel members panel (owner/admin, or the channel's creator)         |
| `user/update-profile/`        | Profile name update form                                                         |
| `user/change-password/`       | Change password form (handles Google accounts)                                   |

### `entities/` — Business objects

Each entity slice owns its **types**, **API calls**, and **React Query hooks**. `useQuery` / `useMutation` live in `model/queries.ts` only.

| Entity          | Key exports                                                                                                                                                                                   |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `user/`         | `useAuth`, `userApi`, `User` type, `Avatar` component                                                                                                                                         |
| `org/`          | `useOrg`, `useOrgs`, `useCreateOrg`, `useUpdateOrg`, `useDeleteOrg`                                                                                                                           |
| `member/`       | `useMembers`, `useMyMembership`, `useMyRole`, `useUpdateMemberRole`, `useRemoveMember`                                                                                                        |
| `invitation/`   | `useOrgInvitations`, `useMyInvitations`, `useAcceptInvitation`, `useSendInvitation`, `useResendInvitation`                                                                                    |
| `program/`      | `usePrograms`, `useProgram`, `useCreateProgram`, `useUpdateProgram`, `useDeleteProgram`                                                                                                       |
| `enrollment/`   | `useEnrollments`, `useMyEnrollment`, `useMyEnrollmentsInOrg`, `useEnroll`, `useDropEnrollment`, `useUpdateEnrollmentStatus`                                                                   |
| `message/`      | `useMessages`, `useSendMessage`                                                                                                                                                               |
| `channel/`      | `useChannels`, `useCreateChannel`, `useDeleteChannel`, `useChannelMessages` (cursor-paginated), `useSendChannelMessage`, `useChannelMembers`, `useAddChannelMember`, `useRemoveChannelMember` |
| `subscription/` | `useOrgSubscription`, `useOrgPayments`, `useCreateCheckout`, `useCancelSubscription`                                                                                                          |

### `shared/` — Non-domain utilities

| Segment       | Contents                                                                                                                                              |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `shared/ui/`  | Button, Input, Textarea, Card, Badge, Spinner, FormField, Label, AuthDivider, ConfirmDialog, DatePicker, MarkdownContent, MarkdownToolbar, ErrorState |
| `shared/api/` | Axios client, silent 401 refresh interceptor, `extractApiError()`                                                                                     |
| `shared/lib/` | `cn()`, `slugify()`, `stripMarkdown()`, `getInitials()`, `getDisplayName()`, `setSessionCookie()`, `queryKeys`                                        |

---

## Role system

Permissions are enforced client-side by `useMyRole(slug)` which calls `GET /organizations/:slug/members/me`. The backend resolves identity from the JWT — no client-side user ID needed.

```ts
const myRole = useMyRole(slug); // "owner" | "admin" | "mentor" | "member" | null
const canManage = myRole === "owner" || myRole === "admin";
```

| Action                               | owner | admin | mentor  | member |
| ------------------------------------ | :---: | :---: | :-----: | :----: |
| Invite / resend / cancel invitations |   ✓   |   ✓   |    —    |   —    |
| Create / edit programs               |   ✓   |   ✓   | ✓ (own) |   —    |
| Delete programs                      |   ✓   |   ✓   |    —    |   —    |
| View enrollment roster               |   ✓   |   ✓   |    ✓    |   —    |
| Enroll in programs                   |   —   |   —   |    —    |   ✓    |
| Send announcements                   |   ✓   |   ✓   |    ✓    |   —    |
| Delete organization                  |   ✓   |   —   |    —    |   —    |

**Channels are a separate permission shape** — posting is membership-based, not role-based: anyone who's a member of a given channel can post in it, regardless of org role.

| Action                     | owner | admin |          mentor           | member |
| -------------------------- | :---: | :---: | :-----------------------: | :----: |
| Create a channel           |   ✓   |   ✓   |             ✓             |   —    |
| Manage a channel's members |   ✓   |   ✓   | ✓ (channels they created) |   —    |
| Delete a channel           |   ✓   |   ✓   |             —             |   —    |

---

## Auth

- **Access token** — in-memory only (Zustand). Never touches `localStorage`.
- **Refresh token** — `localStorage`. Silently exchanged on 401 by the Axios interceptor.
- **Session cookie** (`irb_session`) — set client-side by `AuthProvider` so `proxy.ts` can protect routes server-side without touching tokens.
- **Google OAuth** — uses `@react-oauth/google` `GoogleLogin` component which returns an `idToken` (not an access token). The backend receives the idToken at `POST /auth/google`.

---

## Routes

### Public

| Route | Description  |
| ----- | ------------ |
| `/`   | Landing page |

### Auth (public)

| Route                  | Description                      |
| ---------------------- | -------------------------------- |
| `/login`               | Login (email + Google)           |
| `/register`            | Register (email + Google)        |
| `/verify-email`        | OTP email verification           |
| `/forgot-password`     | Request reset link               |
| `/reset-password`      | Set new password via token       |
| `/invitations/preview` | Preview invite before signing in |
| `/invitations/accept`  | Email CTA — auto-accepts on load |
| `/invitations/decline` | Email CTA — confirm then decline |

### App (authenticated)

| Route                        | Description                      |
| ---------------------------- | -------------------------------- |
| `/dashboard`                 | Stats + org grid                 |
| `/orgs`                      | All organizations                |
| `/orgs/new`                  | Create organization              |
| `/orgs/[slug]`               | Org overview (5-tab nav)         |
| `/orgs/[slug]/members`       | Members list                     |
| `/orgs/[slug]/programs`      | Programs list + create           |
| `/orgs/[slug]/programs/[id]` | Program detail + enrollment      |
| `/orgs/[slug]/messages`      | Announcements feed               |
| `/orgs/[slug]/channels`      | Channel chat                     |
| `/orgs/[slug]/invitations`   | Invitations management           |
| `/orgs/[slug]/billing`       | Plan + payments, Stripe checkout |
| `/orgs/[slug]/settings`      | Org settings                     |
| `/invitations`               | Personal invitation inbox        |
| `/settings`                  | User profile + password          |

---

## Progress

### ✅ Complete

- **Auth** — All auth flows, Google Sign-In, email verification, profile settings
- **Orgs + Members + Invitations** — Full org lifecycle, invitations with email CTA pages, role-gated UI, member role change + removal
- **Programs + Enrollments + Messages** — Full CRUD with role-gated actions, enrollment flow, announcements
- **Billing** — Stripe checkout, plan + payment history, cancel subscription (owner-only), wired end-to-end against the real backend
- **Channels** — Org-scoped group chat (Free: 1 channel, Pro: unlimited), markdown messages with live preview, infinite-scroll history, member management (add/remove)
- **Companion mobile app** ([`irb-forge-mobile`](https://github.com/RB-Isiaq/irb-forge-mobile)) — same backend, native UI, Android APK available via GitHub releases

### 🔲 Known gaps

- **Pagination** — most list endpoints (programs, members, org-wide announcements) still return everything. `/payments` uses `page`/`limit`; channel messages use cursor pagination (`before`/`nextCursor`, with infinite-scroll-up in the UI) — these two are the only paginated lists so far

---

## Getting started

```bash
npm install
cp .env.local.example .env.local   # fill in values
npm run dev
```

> The backend must run on port 4000 to avoid conflict with Next.js dev server on 3000:
>
> ```bash
> # In the backend repo
> PORT=4000 npm run start:dev
> ```

---

## Environment variables

| Variable                       | Description                                         |
| ------------------------------ | --------------------------------------------------- |
| `NEXT_PUBLIC_API_URL`          | Backend base URL (e.g. `http://localhost:4000/api`) |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth client ID from Google Cloud Console    |

---

## Commands

```bash
npm run dev          # development server
npm run build        # production build
npm run lint         # ESLint
npm run type-check   # tsc --noEmit
npm run format       # prettier --write
npm test             # vitest, watch mode
npm run test:run     # vitest, single run (CI)
```

---

## Conventions

- **Commit format** — `type: lowercase subject` (enforced by commitlint). Types: `feat`, `fix`, `chore`, `refactor`, `style`, `docs`, `test`, `perf`, `ci`, `revert`.
- **No `useQuery` in pages** — pages are thin shells. All data fetching lives in widgets or features.
- **`queryKeys` is the single source of truth** — no string literals as cache keys anywhere.
- **`extractApiError(err, fallback)`** — the only way to unwrap API error messages.
- **Canonical Tailwind classes** — `rounded-xl` not `rounded-[12px]`, `max-w-100` not `max-w-[400px]`.
- **New widgets/features/entities ship with a colocated `*.test.tsx`** — Vitest + React Testing Library, mock entity hooks rather than wrapping in a real `QueryClientProvider`. CI (`.github/workflows/ci.yml`) fails the PR if tests don't pass.

---

## Related projects

- **Backend** (`irb-forge`, sibling repo) — NestJS API this app talks to.
- **Mobile** ([`irb-forge-mobile`](https://github.com/RB-Isiaq/irb-forge-mobile)) — Expo/React Native companion app, same backend and domain model. Android APK available via GitHub releases; iOS not yet distributed.
