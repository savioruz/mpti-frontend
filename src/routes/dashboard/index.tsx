import { createFileRoute, redirect } from "@tanstack/react-router";
import { isAdmin, getAccessToken } from "@/lib/auth";
import AdminDashboard from "@/components/pages/admin/admin-dashboard";
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
  },
  component: DashboardPage,
});

function DashboardPage() {
  const userIsAdmin = isAdmin();

  return (
    <div className="container mx-auto py-8">
      {userIsAdmin ? (
        <AdminDashboard />
      ) : (
        <UserDashboard />
      )}
    </div>
  );
}
