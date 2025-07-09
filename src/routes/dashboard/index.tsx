import { createFileRoute, redirect } from "@tanstack/react-router";
import { isStaffOrAdmin, getAccessToken } from "@/lib/auth";
import UserDashboard from "@/components/pages/user-dashboard";

export const Route = createFileRoute("/dashboard/")({
  beforeLoad: async () => {
    const token = getAccessToken();
    if (!token) {
      throw redirect({
        to: "/auth/login",
        search: {
          redirect: "/dashboard",
        },
      });
    }

    // If user is staff or admin, redirect to admin dashboard
    if (isStaffOrAdmin()) {
      throw redirect({
        to: "/admin/dashboard",
      });
    }
  },
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <div className="container mx-auto py-8">
      <UserDashboard />
    </div>
  );
}
