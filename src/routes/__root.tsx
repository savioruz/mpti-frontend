import { createRootRoute, Outlet, useLocation } from "@tanstack/react-router";

import Header from "../components/common/header.tsx";
import Footer from "../components/common/footer.tsx";
import { ThemeProvider } from "@/components/ui/theme-provider.tsx";
import { Toaster } from "@/components/ui/sonner.tsx";

export const Route = createRootRoute({
  component: () => {
    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith("/admin");

    return (
      <>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <div className="min-h-screen flex flex-col">
            <main
              className={isAdminRoute ? "flex-1" : "flex flex-col container mx-auto flex-1"}
            >
              <Header />
              <Outlet />
            </main>
            {!isAdminRoute && <Footer />}
          </div>
          <Toaster position="top-right" richColors={true} />
        </ThemeProvider>
      </>
    );
  },
  errorComponent: () => (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <h1 className="text-6xl font-bold mb-2">404</h1>
      <h2 className="text-2xl font-medium mb-6">Page Not Found</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>
    </div>
  ),

  notFoundComponent: () => (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <h1 className="text-6xl font-bold mb-2">404</h1>
      <h2 className="text-2xl font-medium mb-6">Page Not Found</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>
    </div>
  ),
});
