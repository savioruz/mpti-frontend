import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserRole, type JWTPayload, decodeToken, getAccessToken } from "@/lib/auth";
import AdminSidebar from "./admin-sidebar";
import { SidebarProvider } from "../../ui/sidebar";

const AdminDashboard: React.FC = () => {
  const token = getAccessToken();
  const userInfo = decodeToken(token) as JWTPayload | null;
  const userRole = getUserRole();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 p-6">
          <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
          <Card>
            <CardHeader>
              <CardTitle>Admin Access</CardTitle>
              <CardDescription>You have admin privileges (level {userRole})</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">User Information</h3>
                  <p>Email: {userInfo?.email}</p>
                  <p>ID: {userInfo?.id}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">User Management</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Manage users and permissions</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Content Management</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Manage site content</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Analytics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>View site analytics</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;