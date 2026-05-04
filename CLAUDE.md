@AGENTS.md

# IRB Forge Frontend — Claude Instructions

## Architecture: Feature-Sliced Design (FSD)

This project strictly follows [Feature-Sliced Design](https://feature-sliced.design). Read this before writing any code.

### Layer hierarchy (top → bottom, imports only go downward)

```
app/        Next.js routing + _providers/. Pages = metadata + ONE widget. Nothing else.
widgets/    Self-contained blocks. Compose entities + features. No routing logic.
features/   Single user actions (login, create-org, invite-member). Import entities + shared.
entities/   Business objects. Own their types, api/, model/ (queries), ui/. Import shared only.
shared/     Non-domain. ui/ (design system), api/ (HTTP client), lib/ (utils, queryKeys, types).
```

### Adding a new domain feature — checklist

1. **Type** → `entities/<name>/model/types.ts`
2. **HTTP** → `entities/<name>/api/index.ts` (uses `apiGet/apiPost/etc` from `@/shared/api`)
3. **Queries** → `entities/<name>/model/queries.ts` (uses `queryKeys` from `@/shared/lib`)
4. **Public API** → `entities/<name>/model/index.ts` + `entities/<name>/index.ts`
5. **UI component** (if display-only) → `entities/<name>/ui/`
6. **Feature component** (if user action) → `features/<domain>/<action>/ui/`
7. **Widget** (if composing multiple) → `widgets/<name>/ui/` + `widgets/<name>/index.ts`
8. **Page** (thin shell) → `app/(app)/<route>/page.tsx` — import the widget, done

### Critical rules

- Pages NEVER call `useQuery`, `useMutation`, or define `z.object()` schemas.
- `queryKeys` (`@/shared/lib`) is the ONLY source for React Query cache keys. No string literals.
- `extractApiError` (`@/shared/api`) is the ONLY place to unwrap API error envelopes.
- Every slice must have an `index.ts` public API. Import from the slice root, never from internal paths.
- Zod schemas belong inside the feature or entity that owns the validation, not in shared.

### Next.js 16 specifics

- **`proxy.ts`** (not `middleware.ts`) — Next.js 16 renamed middleware. Export `proxy()` not `middleware()`.
- **`useSearchParams()`** must be wrapped in `<Suspense>` — enforced at build time.
- **`params`** in dynamic routes is now a `Promise<{ slug: string }>` — must be `await`ed.
- **Tailwind v4** config lives in `app/globals.css` via `@theme {}` blocks. No `tailwind.config.js`.
- Use canonical Tailwind classes: `max-w-140` not `max-w-[560px]`, `min-h-75` not `min-h-[300px]`.

### Imports — correct paths

```ts
// shared
import { cn, queryKeys } from "@/shared/lib";
import { extractApiError, apiGet } from "@/shared/api";
import { Button, Card } from "@/shared/ui/button"; // import from file, not barrel for ui

// entities
import { useAuth, userApi, type User } from "@/entities/user";
import { useOrg, useCreateOrg, type Organization } from "@/entities/org";
import { useMembers, type OrgRole } from "@/entities/member";
import { useOrgInvitations, useSendInvitation } from "@/entities/invitation";

// features (import the component directly)
import { LoginForm } from "@/features/auth/login/ui/login-form";
import { CreateOrgForm } from "@/features/org/create-org/ui/create-org-form";

// widgets (import from index)
import { OrgGrid } from "@/widgets/org-grid";
import { Sidebar } from "@/widgets/sidebar";
```

### Commands

```bash
npm run dev       # dev server
npm run build     # production build
npx tsc --noEmit  # type check only
npm run lint      # ESLint
```
