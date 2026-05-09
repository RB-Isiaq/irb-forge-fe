# Backend Requirements — Frontend Contract

This file documents backend endpoints and changes required for full frontend parity.
Items are prioritized: **Critical** blocks existing features, **Needed** is planned but not yet started, **Nice-to-have** is optional.

---

## Critical

### 1. ID-based invitation accept/decline (in-app inbox)

The invitation inbox (`/invitations` page) lists pending invitations and allows the user to accept or decline them. Because `GET /invitations/me` does not expose raw tokens (correct — `select: false`), the inbox cannot use the token-based endpoints. Instead:

```
PATCH /invitations/:id/accept
PATCH /invitations/:id/decline
```

**Contract:**

- Auth: required (JWT)
- Guard: verify `req.user.email === invitation.email` before accepting/declining
- Response: `204 No Content` or the updated `Invitation` object
- On accept: create the `Membership` record (same logic as `POST /invitations/accept`)
- On decline: set `invitation.status = 'declined'`

---

### 2. Email CTA URL alignment

The invitation email currently sends users to:

```
http://<frontend>/invitations/accept?token=<token>
http://<frontend>/invitations/decline?token=<token>
```

These pages now exist in the frontend (`/invitations/accept` and `/invitations/decline`). No backend change needed — just confirm the `FRONTEND_URL` env var points to the correct origin.

Previously the frontend only had `/invitations/preview`, which caused a 404 on email CTAs. This is now fixed on the frontend side.

---

### 3. CORS

`main.ts` does not call `app.enableCors()`. The frontend cannot make API calls from the browser.

```ts
// main.ts
app.enableCors({
  origin: process.env.FRONTEND_URL ?? "http://localhost:3000",
  credentials: true,
});
```

---

## Needed

### 4. Resend invitation

Re-sends the invitation email for a pending invitation.

```
POST /organizations/:slug/invitations/:id/resend
```

**Contract:**

- Auth: required (JWT), caller must be `owner` or `admin` of the org
- Guard: invitation must still be `pending` and not expired
- Action: regenerate the email send (optionally reset `expiresAt`)
- Response: `204 No Content` or updated `Invitation`

---

### 5. `googleId` in `UserResponseDto`

The frontend detects Google accounts via `user.googleId`. Currently `googleId` is excluded from the DTO, so the frontend falls back to always showing the change-password form (which handles the resulting 400 gracefully but is suboptimal UX).

```ts
// user.dto.ts or equivalent
@Expose()
googleId?: string | null;
```

Once exposed, the frontend will:

- Hide the change-password form for Google-only accounts
- Show a "Set a password" link instead

---

### 6. Role-based permission context (optional — currently derived client-side)

The frontend derives the current user's role by filtering `GET /organizations/:slug/members`. This works but requires loading the full members list.

A lighter alternative:

```
GET /organizations/:slug/members/me
```

Returns the current user's `Membership` (id, role, joinedAt). This would allow permission checks without fetching all members.

This is a nice-to-have optimization — the current client-side derivation is correct and cached.

---

## Summary table

| #   | Endpoint                                           | Priority     | Blocks                             |
| --- | -------------------------------------------------- | ------------ | ---------------------------------- |
| 1   | `PATCH /invitations/:id/accept`                    | Critical     | In-app inbox accept                |
| 1   | `PATCH /invitations/:id/decline`                   | Critical     | In-app inbox decline               |
| 3   | `app.enableCors()` in main.ts                      | Critical     | All API calls                      |
| 4   | `POST /organizations/:slug/invitations/:id/resend` | Needed       | Resend button in invitations table |
| 5   | `googleId` in `UserResponseDto`                    | Needed       | Google account UX                  |
| 6   | `GET /organizations/:slug/members/me`              | Nice-to-have | Optimization only                  |
