"use client";

import { useAuth } from "@/entities/user";
import { Avatar } from "@/entities/user/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { getDisplayName } from "@/shared/lib";
import { UpdateProfileForm } from "@/features/user/update-profile/ui/update-profile-form";
import { ChangePasswordForm } from "@/features/user/change-password/ui/change-password-form";

export function UserSettings() {
  const { user, isGoogleAccount } = useAuth();

  if (!user) return null;

  const displayName = getDisplayName(user.firstName, user.lastName, user.email);

  return (
    <div className="space-y-6">
      {/* Profile header */}
      <div className="flex items-center gap-4 p-5 rounded-lg bg-surface border border-border">
        <Avatar firstName={user.firstName} lastName={user.lastName} size="lg" />
        <div className="min-w-0">
          <p className="text-[16px] font-semibold text-text-primary">{displayName}</p>
          <p className="text-[13px] text-text-muted">{user.email}</p>
          <div className="flex items-center gap-2 mt-1.5">
            {user.isVerified ? (
              <Badge variant="success">Verified</Badge>
            ) : (
              <Badge variant="warning">Unverified</Badge>
            )}
            {isGoogleAccount && <Badge variant="outline">Google account</Badge>}
          </div>
        </div>
      </div>

      {/* Profile details */}
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Update your name and display information.</CardDescription>
        </CardHeader>
        <CardContent>
          <UpdateProfileForm />
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>
            {isGoogleAccount
              ? "Manage your account security."
              : "Change your password. You'll be signed out on other devices."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChangePasswordForm />
        </CardContent>
      </Card>
    </div>
  );
}
