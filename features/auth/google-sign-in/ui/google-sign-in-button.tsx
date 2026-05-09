"use client";

import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "@/entities/user";
import { extractApiError } from "@/shared/api";

type GoogleButtonText = "signin_with" | "signup_with" | "continue_with" | "signin";

interface GoogleSignInButtonProps {
  onSuccess: () => void;
  onError?: (message: string) => void;
  text?: GoogleButtonText;
}

export function GoogleSignInButton({
  onSuccess,
  onError,
  text = "continue_with",
}: GoogleSignInButtonProps) {
  const { loginWithGoogle } = useAuth();

  return (
    /*
     * GoogleLogin renders Google's official Sign In With Google button.
     * This is intentional — it uses FedCM/GIS, returns a credential (idToken),
     * and follows Google's branding requirements.
     */
    <GoogleLogin
      width="380"
      theme="outline"
      size="large"
      text={text}
      shape="rectangular"
      logo_alignment="center"
      onSuccess={async ({ credential }) => {
        if (!credential) {
          onError?.("Google did not return a credential. Try again.");
          return;
        }
        try {
          await loginWithGoogle({ idToken: credential });
          onSuccess();
        } catch (err) {
          onError?.(extractApiError(err, "Google sign-in failed. Try again."));
        }
      }}
      onError={() => onError?.("Google sign-in was cancelled or failed.")}
    />
  );
}
