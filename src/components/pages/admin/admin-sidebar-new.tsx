// src/components/pages/admin/admin-sidebar.tsx
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
} from "../../ui/sidebar";
import { Home, Users, BarChart, Building2} from "lucide-react";
import { Link } from "@tanstack/react-router";
import React from "react";

const AdminSidebar: React.FC = () => (
  <Sidebar className="bg-muted border-r">
    <SidebarHeader>
      <Link to="/admin" className="block">
        <div className="font-bold text-lg p-4 hover:bg-gray-100 rounded-md transition-colors">
          Admin Panel
        </div>
      </Link>
    </SidebarHeader>
    <SidebarContent>
      <SidebarMenu>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/admin">
                <Home className="mr-2" /> Dashboard
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarGroup>
      </SidebarMenu>

      <SidebarMenu>
        <SidebarGroup>
          <SidebarGroupLabel>Master Data</SidebarGroupLabel>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/admin/organizations">
                <Building2 className="mr-2" /> Organization
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarGroup>
      </SidebarMenu>

      <SidebarMenu>
        <SidebarGroup>
          <SidebarGroupLabel>Users</SidebarGroupLabel>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Users className="mr-2" /> User Management
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarGroup>
      </SidebarMenu>

      <SidebarMenu>
        <SidebarGroup>
          <SidebarGroupLabel>Reports</SidebarGroupLabel>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <BarChart className="mr-2" /> Analytics
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarGroup>
      </SidebarMenu>
    </SidebarContent>
  </Sidebar>
);

export default AdminSidebar;
