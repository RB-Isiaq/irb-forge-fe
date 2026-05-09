# IRB Forge — Frontend

> **Build. Connect. Scale.**
> The web client for IRB Forge — a multi-tenant SaaS platform for mentorship communities.

---

## Stack

| Concern       | Technology                            |
| ------------- | ------------------------------------- |
| Framework     | Next.js 16 (App Router)               |
| Language      | TypeScript                            |
| Styling       | Tailwind CSS v4                       |
| Server state  | TanStack Query v5                     |
| Client state  | Zustand                               |
| Forms         | React Hook Form + Zod                 |
| HTTP          | Axios (with silent token refresh)     |
| Notifications | Sonner                                |
| Icons         | Lucide React                          |
| Font          | Inter (brand) + JetBrains Mono (code) |

---

## Architecture — Feature-Sliced Design (FSD)

This project strictly follows the [Feature-Sliced Design](https://feature-sliced.design) methodology.

FSD organizes code into **layers**, each divided into **slices** (domain groupings), each divided into **segments** (`ui`, `model`, `api`).

### Layer hierarchy

```
app/          ← Next.js routing + global providers (entry points only)
widgets/      ← Self-contained UI blocks that compose entities + features
features/     ← User interactions and business operations
entities/     ← Business objects: their data, queries, and display
shared/       ← Non-domain reusable code: design system, HTTP client, utilities
```

**The single rule: a layer may only import from layers below it. Never upward, never sideways between slices.**

---

### Layer breakdown

#### `app/` — Entry points + Next.js routing

- File-based routing (Next.js App Router requirement)
- `_providers/` — QueryClient, AuthProvider, Toaster
- Pages contain: `metadata` export + one widget/feature component. Nothing else.

#### `widgets/` — Composed blocks

Large, self-contained UI sections. Each widget has one job and is independently renderable.

| Widget               | Responsibility                        |
| -------------------- | ------------------------------------- |
| `sidebar/`           | Navigation, user info, logout         |
| `unverified-banner/` | Email verification prompt             |
| `org-grid/`          | Organization card list                |
| `org-members/`       | Members table                         |
| `org-invitations/`   | Pending invitations table + send form |
| `org-settings/`      | Settings form + danger zone           |
| `invitations-inbox/` | User's personal invitation inbox      |

#### `features/` — User interactions

Each feature is a specific user action. Features know about entities but not about other features.

| Feature                 | Responsibility           |
| ----------------------- | ------------------------ |
| `auth/login/`           | Login form               |
| `auth/register/`        | Registration form        |
| `auth/forgot-password/` | Forgot password form     |
| `auth/reset-password/`  | Reset password form      |
| `org/create-org/`       | Create organization form |
| `org/invite-member/`    | Invite member form       |

#### `entities/` — Business objects

Each entity slice owns its **types**, **API calls**, and **query hooks**. The `model/` segment is the only place `useQuery` and `useMutation` are called.

| Entity        | Segments                                                                                     |
| ------------- | -------------------------------------------------------------------------------------------- |
| `user/`       | `api/` (auth + profile HTTP), `model/` (types, Zustand store, `useAuth`), `ui/` (Avatar)     |
| `org/`        | `api/` (org CRUD HTTP), `model/` (types, `useOrg`, `useCreateOrg`, etc.)                     |
| `member/`     | `api/` (member HTTP), `model/` (types, `useMembers`, `useRemoveMember`, etc.)                |
| `invitation/` | `api/` (invitation HTTP), `model/` (types, `useOrgInvitations`, `useAcceptInvitation`, etc.) |

#### `shared/` — Reusable, non-domain

| Segment       | Contents                                                                       |
| ------------- | ------------------------------------------------------------------------------ |
| `shared/ui/`  | Design system: Button, Input, Textarea, Card, Badge, Spinner, FormField, Label |
| `shared/api/` | Axios client + silent token refresh interceptor, `extractApiError()`           |
| `shared/lib/` | `cn()`, `slugify()`, `queryKeys` factory, API envelope types                   |

---

### Public API (`index.ts`) rule

Every slice exposes a public API via its `index.ts`. Consumers import from the slice root only.

```ts
// ✅ Correct
import { useOrg, useCreateOrg } from "@/entities/org";

// ❌ Never do this
import { useOrg } from "@/entities/org/model/queries";
```

---

### Import direction

```
app  →  widgets  →  features  →  entities  →  shared
```

---

## Auth

- **Access token** — in-memory (Zustand). Restored via silent refresh on mount.
- **Refresh token** — `localStorage`. Exchanged on 401 by the Axios interceptor automatically.
- **Session cookie** (`irb_session`) — set client-side by `AuthProvider` so `proxy.ts` can protect routes.

---

## Getting started

```bash
npm install
# copy and fill in env vars
cp .env.local .env.local.example
npm run dev
```

---

## Environment variables

| Variable                       | Description                                             |
| ------------------------------ | ------------------------------------------------------- |
| `NEXT_PUBLIC_API_URL`          | Backend base URL (default: `http://localhost:3000/api`) |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth client ID                                  |
