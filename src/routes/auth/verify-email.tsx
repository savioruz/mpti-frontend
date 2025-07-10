import { createFileRoute } from "@tanstack/react-router";
import { EmailVerificationForm } from "@/components/pages/email-verification-form";

export const Route = createFileRoute("/auth/verify-email")({
  component: EmailVerification,
});

function EmailVerification() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <EmailVerificationForm />
      </div>
    </div>
  );
}
