import { createFileRoute, redirect } from '@tanstack/react-router'
import { getAccessToken, isStaffOrAdmin } from '@/lib/auth'

export const Route = createFileRoute('/admin/')({
  beforeLoad: async () => {
    const token = getAccessToken();
    if (!token) {
      throw redirect({
        to: "/auth/login",
        search: {
          redirect: "/admin/dashboard",
        },
      });
    }
    
    // Check if user has staff or admin role
    if (!isStaffOrAdmin()) {
      throw redirect({
        to: "/dashboard", // Regular users go to user dashboard
      });
    }
    
    // Redirect to admin dashboard
    throw redirect({
      to: "/admin/dashboard",
    });
  },
  component: () => null, // This component will never render due to redirect
})


