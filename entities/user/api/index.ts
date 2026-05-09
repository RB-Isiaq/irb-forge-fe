import { apiPost, apiGet, apiPatch } from "@/shared/api";
import type {
  AuthResponse,
  AuthTokens,
  User,
  RegisterPayload,
  LoginPayload,
  VerifyEmailPayload,
  ResendVerificationPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  ChangePasswordPayload,
  GoogleSignInPayload,
} from "../model/types";

export const userApi = {
  register: (data: RegisterPayload) => apiPost<AuthResponse>("/auth/register", data),
  login: (data: LoginPayload) => apiPost<AuthTokens>("/auth/login", data),
  googleSignIn: (data: GoogleSignInPayload) => apiPost<AuthTokens>("/auth/google", data),
  verifyEmail: (data: VerifyEmailPayload) =>
    apiPost<{ message: string }>("/auth/verify-email", data),
  resendVerification: (data: ResendVerificationPayload) =>
    apiPost<{ message: string }>("/auth/resend-verification", data),
  forgotPassword: (data: ForgotPasswordPayload) =>
    apiPost<{ message: string }>("/auth/forgot-password", data),
  resetPassword: (data: ResetPasswordPayload) =>
    apiPost<{ message: string }>("/auth/reset-password", data),
  changePassword: (data: ChangePasswordPayload) =>
    apiPost<{ message: string }>("/auth/change-password", data),
  logout: () => apiPost<{ message: string }>("/auth/logout"),
  getProfile: () => apiGet<User>("/users/me"),
  updateProfile: (data: Partial<Pick<User, "firstName" | "lastName">>) =>
    apiPatch<User>("/users/me", data),
};
