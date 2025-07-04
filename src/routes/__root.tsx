import {createRootRoute, Outlet} from '@tanstack/react-router'
import {TanStackRouterDevtools} from '@tanstack/react-router-devtools'

import Header from '../components/common/header.tsx'
import {ThemeProvider} from "@/components/ui/theme-provider.tsx";
import {Toaster} from "@/components/ui/sonner.tsx";

export const Route = createRootRoute({
    component: () => (
        <>
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                <main className="flex flex-col container mx-auto">
                    <Header/>
                    <Outlet/>
                    <TanStackRouterDevtools/>
                </main>
                <Toaster
                    position="top-right"
                    richColors={true}
                />
            </ThemeProvider>
        </>
    ),
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
})