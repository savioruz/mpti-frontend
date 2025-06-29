import React from "react";
import { SidebarTrigger } from "../../ui/sidebar";

const AdminNavbar: React.FC = () => (
  <nav className="flex items-center justify-between px-4 py-2 bg-white border-b">
    <SidebarTrigger />
    <span className="font-bold">Admin Panel</span>
    {/* Tambahkan elemen lain jika perlu */}
  </nav>
);

export default AdminNavbar;