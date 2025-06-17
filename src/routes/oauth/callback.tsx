import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { saveAuthTokens } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/oauth/callback")({
  component: OAuthCallbackPage,
});

function OAuthCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      // Show loading toast
      const loadingToast = toast.loading("Completing authentication...");

      try {
        // Extract tokens directly from URL query parameters
        const searchParams = new URLSearchParams(window.location.search);
        const accessToken = searchParams.get("access_token");
        const refreshToken = searchParams.get("refresh_token");
        const error = searchParams.get("error");
        const state = searchParams.get("state");

        // Handle error from OAuth provider
        if (error) {
          toast.dismiss(loadingToast);
          toast.error(`Authentication failed: ${error}`);
          navigate({ to: "/auth/login" });
          return;
        }

        // Handle missing tokens
        if (!accessToken || !refreshToken) {
          toast.dismiss(loadingToast);
          toast.error("Authentication failed: Missing tokens");
          navigate({ to: "/auth/login" });
          return;
        }

        // Save the tokens to localStorage
        saveAuthTokens(accessToken, refreshToken);

        // Verify the state parameter matches what we stored (optional)
        const savedState = localStorage.getItem('oauth_state');
        if (savedState && state && savedState !== state) {
          toast.dismiss(loadingToast);
          toast.error("Authentication failed: Invalid state parameter");
          navigate({ to: "/auth/login" });
          return;
        }

        // Clean up state after use
        localStorage.removeItem('oauth_state');

        // Dismiss loading toast and show success
        toast.dismiss(loadingToast);
        toast.success("Successfully logged in with Google!");

        // Redirect to home page
        navigate({ to: "/" });
      } catch (error) {
        toast.error("An unexpected error occurred during authentication");
        navigate({ to: "/auth/login" });
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Authenticating with Google</h1>
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p>Completing your authentication, please wait...</p>
        </div>
      </div>
    </div>
  );
}
