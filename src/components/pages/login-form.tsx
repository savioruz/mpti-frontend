import {cn} from "@/lib/utils.ts"
import {Button} from "@/components/ui/button.tsx"
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card.tsx"
import {Input} from "@/components/ui/input.tsx"
import {Label} from "@/components/ui/label.tsx"
import {Link, useNavigate} from "@tanstack/react-router";
import {publicLinks} from "@/lib/link.ts";
import {useState} from "react";
import {EyeIcon, EyeOffIcon, Loader2Icon} from "lucide-react";
import {useLogin, saveAuthTokens, type UserLoginRequest, initiateGoogleLogin} from "@/lib/auth.ts";
import {toast} from "sonner";

export function LoginForm({
                              className,
                              ...props
                          }: React.ComponentProps<"div">) {
    const [showPassword, setShowPassword] = useState(false);
    const [loginData, setLoginData] = useState<UserLoginRequest>({
        email: "",
        password: "",
    });
    const navigate = useNavigate();
    const loginMutation = useLogin();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setLoginData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await loginMutation.mutateAsync(loginData);
            saveAuthTokens(response.data.access_token, response.data.refresh_token);
            toast.success("Login successful");
            navigate({ to: "/dashboard" });
        } catch (error) {
            console.error("Login failed:", error);
            toast.error("Login failed. Please check your credentials.");
        }
    };

    const handleGoogleLogin = () => {
        initiateGoogleLogin();
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Welcome back</CardTitle>
                    <CardDescription>
                        Login with Google account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-6">
                            <div className="flex flex-col gap-4">
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    type="button"
                                    onClick={handleGoogleLogin}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="mr-2 h-4 w-4">
                                        <path
                                            d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                    Login with Google
                                </Button>
                            </div>
                            <div
                                className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Or continue with
                </span>
                            </div>
                            <div className="grid gap-6">
                                <div className="grid gap-3">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="your-mail@example.com"
                                        required
                                        value={loginData.email}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <div className="flex items-center">
                                        <Label htmlFor="password">Password</Label>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            type="button"
                                            className="ml-auto"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <EyeOffIcon className="h-4 w-4"/>
                                            ) : (
                                                <EyeIcon className="h-4 w-4"/>
                                            )}
                                        </Button>
                                    </div>
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={loginData.password}
                                        onChange={handleInputChange}
                                    />
                                    <Link
                                        to={publicLinks.forgotPassword.to}
                                        className=" text-sm underline-offset-4 hover:underline"
                                    >
                                        Forgot your password ?
                                    </Link>
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={loginMutation.isPending}
                                >
                                    {loginMutation.isPending ? (
                                        <>
                                            <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                                            Logging in...
                                        </>
                                    ) : (
                                        "Login"
                                    )}
                                </Button>
                            </div>
                            <div className="text-center text-sm">
                                Don&apos;t have an account?{" "}
                                <Link to={publicLinks.register.to} className="underline underline-offset-4">
                                    Sign up
                                </Link>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
            <div
                className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                By clicking continue, you agree to our <Link to={publicLinks.tos.to}>Terms of Service</Link>{" "}
                and <Link to={publicLinks.privacyPolicy.to}>Privacy Policy</Link>.
            </div>
        </div>
    )
}
