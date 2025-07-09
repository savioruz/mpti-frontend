import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import type { User } from "@/lib/user";
import {
  getUserLevelLabel,
  getUserLevelColor,
  useUpdateUserRole,
} from "@/lib/user";

interface UserDetailsDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserDetailsDialog({
  user,
  open,
  onOpenChange,
}: UserDetailsDialogProps) {
  const [selectedLevel, setSelectedLevel] = useState<"1" | "2" | "9">();
  const updateUserRole = useUpdateUserRole();

  if (!user) return null;

  const handleUpdateRole = async () => {
    if (!selectedLevel || selectedLevel === user.level) {
      toast.error("Please select a different role");
      return;
    }

    try {
      await updateUserRole.mutateAsync({ id: user.id, level: selectedLevel });
      toast.success("User role updated successfully");
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to update user role");
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Profile Section */}
          <div className="flex items-start space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.profile_image} alt={user.full_name} />
              <AvatarFallback className="text-lg">
                {getInitials(user.full_name)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-2">
              <div className="flex items-center space-x-2">
                <h3 className="text-xl font-semibold">{user.full_name}</h3>
                <Badge className={getUserLevelColor(user.level)}>
                  {getUserLevelLabel(user.level)}
                </Badge>
                {user.is_verified && (
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 border-green-200"
                  >
                    Verified
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <Separator />

          {/* User Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="font-medium text-sm text-muted-foreground">
                User ID
              </Label>
              <p className="text-sm font-mono bg-muted p-2 rounded">
                {user.id}
              </p>
            </div>

            <div>
              <Label className="font-medium text-sm text-muted-foreground">
                Email Status
              </Label>
              <p className="text-sm">
                {user.is_verified ? (
                  <span className="text-green-600">Verified</span>
                ) : (
                  <span className="text-red-600">Not Verified</span>
                )}
              </p>
            </div>

            <div>
              <Label className="font-medium text-sm text-muted-foreground">
                Last Login
              </Label>
              <p className="text-sm">
                {user.last_login
                  ? new Date(user.last_login).toLocaleString()
                  : "Never"}
              </p>
            </div>

            <div>
              <Label className="font-medium text-sm text-muted-foreground">
                Member Since
              </Label>
              <p className="text-sm">
                {new Date(user.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          <Separator />

          {/* Role Management */}
          <div className="space-y-4">
            <Label className="font-medium">Update User Role</Label>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <Select
                  value={selectedLevel}
                  onValueChange={(value) =>
                    setSelectedLevel(value as "1" | "2" | "9")
                  }
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={`Current: ${getUserLevelLabel(user.level)}`}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">User (Level 1)</SelectItem>
                    <SelectItem value="2">Staff (Level 2)</SelectItem>
                    <SelectItem value="9">Admin (Level 9)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleUpdateRole}
                disabled={
                  updateUserRole.isPending ||
                  !selectedLevel ||
                  selectedLevel === user.level
                }
              >
                {updateUserRole.isPending ? "Updating..." : "Update Role"}
              </Button>
            </div>

            <div className="text-xs text-muted-foreground">
              <p>
                <strong>User (Level 1):</strong> Regular user with basic
                permissions
              </p>
              <p>
                <strong>Staff (Level 2):</strong> Staff member with extended
                permissions
              </p>
              <p>
                <strong>Admin (Level 9):</strong> Administrator with full access
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
