import { cn } from "@/lib/utils.ts";
import { Button } from "@/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Link, useSearch } from "@tanstack/react-router";
import { publicLinks } from "@/lib/link.ts";
import { Loader2Icon, CheckCircle, XCircle, Mail } from "lucide-react";
import { useVerifyEmail } from "@/lib/auth.ts";

export function EmailVerificationForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const search = useSearch({ from: "/auth/verify-email" });
  const token = (search as any)?.token || "";
  
  const { data: verificationResult, isLoading, error } = useVerifyEmail(token);

  // Show loading state while verifying email
  if (isLoading) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Verifying Your Email</CardTitle>
            <CardDescription>
              Please wait while we verify your email address...
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center py-8">
            <Loader2Icon className="h-8 w-8 animate-spin mx-auto text-emerald-600" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show error if verification failed
  if (error) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
              <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <CardTitle className="text-xl">Verification Failed</CardTitle>
            <CardDescription>
              We couldn't verify your email address.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              {error instanceof Error ? error.message : "The verification link is invalid or has expired."}
            </p>
            <p className="text-sm text-muted-foreground text-center">
              Please check your email for a new verification link or contact support if you continue to have issues.
            </p>
            <Button
              asChild
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
            >
              <Link to={publicLinks.login.to}>
                Continue to Login
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show success message after successful verification
  if (verificationResult) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/20">
              <CheckCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <CardTitle className="text-xl">Email Verified Successfully!</CardTitle>
            <CardDescription>
              Your email address has been successfully verified.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              {verificationResult.data.message || "Thank you for verifying your email address. You can now access all features of your account."}
            </p>
            <Button
              asChild
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
            >
              <Link to={publicLinks.login.to}>
                Continue to Login
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show default state if no token is provided
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
            <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <CardTitle className="text-xl">Email Verification Required</CardTitle>
          <CardDescription>
            Please check your email for a verification link.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            If you haven't received a verification email, please check your spam folder or contact support.
          </p>
          <Button
            asChild
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
          >
            <Link to={publicLinks.login.to}>
              Back to Login
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
