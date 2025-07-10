import { useState, useEffect } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { publicNavLink } from "@/lib/nav.ts";
import { ModeToggle } from "@/components/ui/mode-toggle.tsx";
import { Button } from "@/components/ui/button.tsx";
import { LogIn, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import { publicLinks } from "@/lib/link.ts";
import { useCheckAuthStatus } from "@/lib/auth.ts";
import { ProfileDropdown } from "@/components/common/profile-dropdown.tsx";
import { cn } from "@/lib/utils";

export default function Header() {
  const [isMobile, setIsMobile] = useState(false);
  const { data: authStatus, isLoading: isAuthLoading } = useCheckAuthStatus();
  const location = useLocation();

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();

    window.addEventListener("resize", checkIfMobile);

    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const isActiveLink = (linkPath: string) => {
    return location.pathname === linkPath;
  };

  return (
    <header className="border-b bg-background/95 px-4 md:px-8 py-1 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-14 items-center justify-between">
        <div className="flex items-center md:gap-6">
          <Link to="/" className="text-md font-bold md:text-lg">
            Alkidi
          </Link>
        </div>

        {!isMobile && (
          <div className="flex items-center gap-4">
            {publicNavLink.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-foreground relative",
                  isActiveLink(link.to) 
                    ? "text-emerald-600 dark:text-emerald-400" 
                    : "text-muted-foreground"
                )}
              >
                {link.label}
                {isActiveLink(link.to) && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></span>
                )}
              </Link>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 md:gap-4 z-20">
          {isAuthLoading ? (
            <Button disabled size="icon" variant="outline">
              <span className="animate-spin">⣾</span>
            </Button>
          ) : authStatus?.isAuthenticated ? (
            <ProfileDropdown />
          ) : (
            <Link to={publicLinks.login.to}>
              <Button size="icon" variant="outline">
                <LogIn size={20} />
              </Button>
            </Link>
          )}

          <ModeToggle />

          {isMobile && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost" className="md:hidden">
                  <Menu size={20} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {publicNavLink.map((link) => (
                  <DropdownMenuItem key={link.to} asChild>
                    <Link
                      to={link.to}
                      className={cn(
                        "w-full cursor-pointer transition-colors hover:text-foreground",
                        isActiveLink(link.to) 
                          ? "text-emerald-600 dark:text-emerald-400 font-medium" 
                          : "text-muted-foreground"
                      )}
                    >
                      {link.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </nav>
    </header>
  );
}
