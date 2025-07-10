import { createFileRoute } from "@tanstack/react-router";
import { ResetPasswordForm } from "@/components/pages/reset-password-form";
import { z } from "zod";

const resetPasswordSearchSchema = z.object({
  token: z.string().optional(),
});

export const Route = createFileRoute("/auth/reset-password")({
  component: ResetPassword,
  validateSearch: resetPasswordSearchSchema,
});

function ResetPassword() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <ResetPasswordForm />
      </div>
    </div>
  );
}
