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
import { Link, useNavigate } from "@tanstack/react-router";
import { publicLinks } from "@/lib/link.ts";
import { useState } from "react";
import { EyeIcon, EyeOffIcon, Loader2Icon } from "lucide-react";
import {
  useRegister,
  initiateGoogleLogin,
  saveAuthTokens,
  type UserRegisterRequest,
} from "@/lib/auth.ts";
import { toast } from "sonner";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [showPassword, setShowPassword] = useState(false);
  const [registerData, setRegisterData] = useState<
    UserRegisterRequest & { confirmPassword: string }
  >({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Partial<typeof registerData>>({});
  const navigate = useNavigate();
  const registerMutation = useRegister();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [id]: value }));

    // Clear error when typing
    if (errors[id as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [id]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<typeof registerData> = {};

    // Validate name
    if (!registerData.name.trim()) {
      newErrors.name = "Name is required";
    }

    // Validate email
    if (!registerData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerData.email)) {
      newErrors.email = "Invalid email format";
    }

    // Validate password
    if (!registerData.password) {
      newErrors.password = "Password is required";
    } else if (registerData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    // Validate password confirmation
    if (registerData.password !== registerData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...registerPayload } = registerData;
      const response = await registerMutation.mutateAsync(registerPayload);

      // Save tokens if they are returned from registration
      if (response.data?.access_token && response.data?.refresh_token) {
        saveAuthTokens(response.data.access_token, response.data.refresh_token);
        toast.success("Welcome! Your account has been created successfully.");
        navigate({ to: "/dashboard" });
      } else {
        // If no tokens, registration might require email verification
        toast.success(
          "Registration successful! Please check your email to verify your account.",
        );
        navigate({ to: "/auth/login" });
      }
    } catch (error: any) {
      console.error("Registration failed:", error);
      
      // Handle different HTTP status codes and specific error messages
      if (error?.response?.status) {
        const status = error.response.status;
        const errorMessage = error.response?.data?.message || error.response?.data?.detail || "";
        const errorData = error.response?.data || {};
        
        // Check for specific error messages first
        if (errorMessage.toLowerCase().includes("email already exists") ||
            errorMessage.toLowerCase().includes("user already exists") ||
            errorMessage.toLowerCase().includes("account already exists") ||
            errorData.error_type === "email_already_exists") {
          toast.error("An account with this email already exists. Please use a different email or try logging in.");
          return;
        }
        
        if (errorMessage.toLowerCase().includes("invalid email") ||
            errorMessage.toLowerCase().includes("email format") ||
            errorData.error_type === "invalid_email") {
          toast.error("Please enter a valid email address.");
          return;
        }
        
        if (errorMessage.toLowerCase().includes("password too weak") ||
            errorMessage.toLowerCase().includes("password requirements") ||
            errorData.error_type === "weak_password") {
          toast.error("Password is too weak. Please use a stronger password with at least 8 characters.");
          return;
        }
        
        // Handle by HTTP status code
        switch (status) {
          case 400:
            toast.error(errorMessage || "Invalid registration data. Please check your input and try again.");
            break;
          case 409:
            toast.error(errorMessage || "An account with this email already exists. Please use a different email or try logging in.");
            break;
          case 422:
            toast.error(errorMessage || "Invalid data provided. Please check all fields and try again.");
            break;
          case 429:
            toast.error(errorMessage || "Too many registration attempts. Please try again later.");
            break;
          case 500:
            toast.error("Server error. Please try again later.");
            break;
          default:
            if (status >= 400 && status < 500) {
              toast.error(errorMessage || "Registration failed. Please check your input.");
            } else {
              toast.error("Registration failed. Please try again later.");
            }
        }
      } else if (error instanceof Error) {
        toast.error(`Registration failed: ${error.message}`);
      } else {
        toast.error("Registration failed. Please check your connection and try again.");
      }
    }
  };

  const handleGoogleRegister = () => {
    // Use the same Google OAuth flow for registration
    initiateGoogleLogin();
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-0 shadow-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 pointer-events-none" />
        <CardHeader className="text-center space-y-2 pb-8 relative">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg ring-4 ring-emerald-500/20">
            <svg
              className="h-8 w-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Create your account
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            Join us and start your journey today
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 relative">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              <div className="flex flex-col gap-4">
                <Button
                  variant="outline"
                  className="w-full h-12 text-base border-2 border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50 dark:border-emerald-800 dark:hover:bg-emerald-950/20 transition-all duration-200 group"
                  type="button"
                  onClick={handleGoogleRegister}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-200"
                  >
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Continue with Google
                </Button>
              </div>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-emerald-200 dark:border-emerald-800"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white dark:bg-slate-900 px-4 text-muted-foreground font-medium">
                    Or continue with email
                  </span>
                </div>
              </div>
              <div className="grid gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-foreground">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    required
                    value={registerData.name}
                    onChange={handleInputChange}
                    className={cn(
                      "h-12 text-base border-2 transition-all duration-200 focus:ring-2 focus:ring-emerald-500/20",
                      errors.name
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                        : "border-emerald-200 focus:border-emerald-500 dark:border-emerald-800 dark:focus:border-emerald-400"
                    )}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm font-medium animate-in slide-in-from-top-1 duration-200">
                      {errors.name}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-foreground">
                    Email address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    required
                    value={registerData.email}
                    onChange={handleInputChange}
                    className={cn(
                      "h-12 text-base border-2 transition-all duration-200 focus:ring-2 focus:ring-emerald-500/20",
                      errors.email
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                        : "border-emerald-200 focus:border-emerald-500 dark:border-emerald-800 dark:focus:border-emerald-400"
                    )}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm font-medium animate-in slide-in-from-top-1 duration-200">
                      {errors.email}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-foreground">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      required
                      value={registerData.password}
                      onChange={handleInputChange}
                      className={cn(
                        "h-12 text-base border-2 pr-12 transition-all duration-200 focus:ring-2 focus:ring-emerald-500/20",
                        errors.password
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                          : "border-emerald-200 focus:border-emerald-500 dark:border-emerald-800 dark:focus:border-emerald-400"
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-12 w-12 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOffIcon className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm font-medium animate-in slide-in-from-top-1 duration-200">
                      {errors.password}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      required
                      value={registerData.confirmPassword}
                      onChange={handleInputChange}
                      className={cn(
                        "h-12 text-base border-2 pr-12 transition-all duration-200 focus:ring-2 focus:ring-emerald-500/20",
                        errors.confirmPassword
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                          : "border-emerald-200 focus:border-emerald-500 dark:border-emerald-800 dark:focus:border-emerald-400"
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-12 w-12 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOffIcon className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm font-medium animate-in slide-in-from-top-1 duration-200">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full h-12 text-base bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending ? (
                    <>
                      <Loader2Icon className="mr-2 h-5 w-5 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create account"
                  )}
                </Button>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link
                    to={publicLinks.login.to}
                    className="text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300 font-medium transition-colors duration-200 hover:underline"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-center text-xs text-muted-foreground space-x-1">
        <span>By continuing, you agree to our</span>
        <Link
          to={publicLinks.tos.to}
          className="text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors duration-200 hover:underline"
        >
          Terms of Service
        </Link>
        <span>and</span>
        <Link
          to={publicLinks.privacyPolicy.to}
          className="text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors duration-200 hover:underline"
        >
          Privacy Policy
        </Link>
      </div>
    </div>
  );
}
