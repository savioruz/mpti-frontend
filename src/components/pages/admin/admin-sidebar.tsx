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
  SidebarSeparator,
} from "../../ui/sidebar";
import { Home, Users, FileText, BarChart, MapPin, List} from "lucide-react";
import React from "react";

interface AdminSidebarProps {
  onMenuClick?: (menu: string) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ onMenuClick }) => (
  <Sidebar className="bg-muted border-r">
    <SidebarHeader>
      <div 
        className="font-bold text-lg p-4 cursor-pointer hover:bg-gray-100 rounded-md transition-colors"
        onClick={() => onMenuClick?.("")} // Empty string untuk dashboard
      >
        Admin Panel
      </div>
    </SidebarHeader>
    <SidebarContent>
      <SidebarMenu>
        <SidebarGroup>
          <SidebarGroupLabel>Lokasi</SidebarGroupLabel>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => onMenuClick?.("tambah-lokasi")}>
              <MapPin className="mr-2" /> Tambah Lokasi Baru
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => onMenuClick?.("list-lokasi")}>
              <List className="mr-2" /> List Semua Lokasi
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarGroup>
      </SidebarMenu>

      <SidebarMenu>
        <SidebarGroup>
          <SidebarGroupLabel>Fields</SidebarGroupLabel>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => onMenuClick?.("")}>
              <Home className="mr-2" /> Dashboard
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Users className="mr-2" /> User Management
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <FileText className="mr-2" /> Content Management
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <BarChart className="mr-2" /> Analytics
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarGroup>
      </SidebarMenu>
      <SidebarSeparator />
    </SidebarContent>
  </Sidebar>
);

export default AdminSidebar;