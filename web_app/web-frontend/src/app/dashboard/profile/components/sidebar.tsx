"use client";

import React from "react";
import SidebarItem from "./sidebarItem";
import { FaUserCircle, FaStar } from "react-icons/fa";

const Sidebar = ({ active }: { active: string }) => {
  return (
    <aside className="w-64 bg-white shadow p-6 space-y-6">
      <div className="text-sm text-gray-500">
        Beranda &gt; <span className="text-red-600 font-semibold">Profil</span>
      </div>
      <div className="space-y-4">
        <SidebarItem
          icon={<FaUserCircle />}
          label="Detail Profil"
          href="/dashboard/profile/detail"
          active={active === "detail"}
        />
        <SidebarItem
          icon={<FaStar />}
          label="Level"
          href="/dashboard/profile/level"
          active={active === "level"}
        />
      </div>
    </aside>
  );
};

export default Sidebar;
