"use client";

import Link from "next/link";
import React from "react";

type Props = {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
};

const SidebarItem: React.FC<Props> = ({ icon, label, href, active }) => {
  return (
    <Link href={href}>
      <div
        className={`flex items-center gap-3 p-2 rounded cursor-pointer ${
          active
            ? "text-red-600 font-semibold"
            : "text-gray-600 hover:text-red-500"
        }`}
      >
        <span className="text-lg">{icon}</span>
        <span>{label}</span>
      </div>
    </Link>
  );
};

export default SidebarItem;
