import { cn } from "@/lib/utils.ts";
import { Button } from "@/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Link } from "@tanstack/react-router";
import { publicLinks } from "@/lib/link.ts";
import { useState } from "react";
import { Loader2Icon, ArrowLeft, Mail } from "lucide-react";
import {
  useForgotPassword,
} from "@/lib/auth.ts";
import { toast } from "sonner";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const forgotPasswordMutation = useForgotPassword();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    try {
      const response = await forgotPasswordMutation.mutateAsync({ email });
      setIsEmailSent(true);
      toast.success(response.data.message || "Password reset email sent");
    } catch (error: any) {
      console.error("Forgot password failed:", error);
      
      // Handle different HTTP status codes
      if (error?.response?.status) {
        const status = error.response.status;
        const errorMessage = error.response?.data?.message || error.response?.data?.detail || "An error occurred";
        
        switch (status) {
          case 400:
            toast.error("Invalid email format. Please enter a valid email address.");
            break;
          case 404:
            toast.error("No account found with this email address.");
            break;
          case 422:
            toast.error("Invalid email provided. Please check your input.");
            break;
          case 429:
            toast.error("Too many reset attempts. Please try again later.");
            break;
          case 500:
            toast.error("Server error. Please try again later.");
            break;
          default:
            if (status >= 400 && status < 500) {
              toast.error(errorMessage || "Failed to send reset email. Please try again.");
            } else {
              toast.error("Failed to send reset email. Please try again later.");
            }
        }
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to send reset email. Please check your connection and try again.");
      }
    }
  };

  if (isEmailSent) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/20">
              <Mail className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <CardTitle className="text-xl">Check Your Email</CardTitle>
            <CardDescription>
              We've sent a password reset link to <strong>{email}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              Didn't receive the email? Check your spam folder or try again.
            </p>
            <Button
              variant="outline"
              onClick={() => setIsEmailSent(false)}
              className="w-full"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Reset Password
            </Button>
            <div className="text-center">
              <Link
                to={publicLinks.login.to}
                className="text-sm text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300"
              >
                Back to Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Reset Your Password</CardTitle>
          <CardDescription>
            Enter your email address and we'll send you a link to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
              disabled={forgotPasswordMutation.isPending}
            >
              {forgotPasswordMutation.isPending ? (
                <>
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <Link
              to={publicLinks.login.to}
              className="text-sm text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300"
            >
              <ArrowLeft className="mr-1 h-3 w-3 inline" />
              Back to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
