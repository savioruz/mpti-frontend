import { useUserProfile, logout } from "@/lib/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LogOut, User, LayoutDashboard } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "@tanstack/react-router";

interface ProfileDropdownProps {
  triggerContent?: React.ReactNode;
}

export function ProfileDropdown({ triggerContent }: ProfileDropdownProps) {
  const { data: profile, isLoading } = useUserProfile();
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="outline" className="relative">
          {triggerContent || (
            profile?.profile_image ? (
              <Avatar className="h-7 w-7">
                <AvatarImage src={profile.profile_image} alt={profile.name} />
                <AvatarFallback>{profile.name?.charAt(0)?.toUpperCase()}</AvatarFallback>
              </Avatar>
            ) : (
              <User size={20} />
            )
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="flex flex-col items-center gap-2 p-2">
          {isLoading ? (
            <div className="py-2 flex justify-center w-full">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 dark:border-white"></div>
            </div>
          ) : profile ? (
            <>
              <Avatar className="h-16 w-16 mb-2">
                <AvatarImage src={profile.profile_image} alt={profile.name} />
                <AvatarFallback>{profile.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <DropdownMenuLabel className="font-medium text-center">
                Welcome, {profile.name}
              </DropdownMenuLabel>
              <p className="text-sm text-muted-foreground pb-2">{profile.email}</p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Unable to load profile data.</p>
          )}
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="cursor-pointer flex items-center gap-2"
          onClick={() => navigate({ to: '/dashboard' })}
        >
          <LayoutDashboard size={16} />
          <span>Dashboard</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          className="cursor-pointer text-destructive focus:text-destructive flex items-center gap-2"
          onClick={() => logout()}
        >
          <LogOut size={16} />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
