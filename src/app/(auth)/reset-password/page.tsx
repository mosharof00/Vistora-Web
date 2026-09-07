import { updatePassword } from "@/app/(auth)/actions";
import { PasswordForm } from "@/components/auth/password-form";

export default function ResetPasswordPage() {
  return (
    <PasswordForm
      action={updatePassword}
      title="Reset password"
      description="Enter a new password for your account."
      submitLabel="Update password"
    />
  );
}
