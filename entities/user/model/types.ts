export type PlatformRole = "user" | "super_admin";

export interface User {
  id: string;
  email: string;
  // Backend UserResponseDto declares these nullable — Google sign-in may omit them
  firstName: string | null;
  lastName: string | null;
  isVerified: boolean;
  role: PlatformRole;
  // Not returned by backend yet — keep optional until UserResponseDto exposes it
  googleId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

/* ─── Request payloads ──────────────────────────────── */

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface VerifyEmailPayload {
  otp: string;
}
export interface ResendVerificationPayload {
  email: string;
}
export interface ForgotPasswordPayload {
  email: string;
}
export interface ResetPasswordPayload {
  token: string;
  password: string;
}
export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}
export interface GoogleSignInPayload {
  idToken: string;
}
