"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Search, Bell, User } from "lucide-react";
import { useAuth } from "../utils/AuthContext";
import { useRouter } from "next/navigation";

export default function HeaderAuth() {
  const { logOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const notificationCount = 2;

  const handleLogout = async () => {
    try {
      await logOut();
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const isActiveRoute = (route: string) => {
    if (route === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname?.startsWith(route);
  };

  const isDashboard = pathname === "/dashboard";

  const headerBgClass = isDashboard ? "bg-[#B80A00]" : "bg-white";
  const textColorClass = isDashboard ? "text-white" : "text-gray-800";
  const hoverBgClass = isDashboard ? "hover:bg-red-700" : "hover:bg-gray-100";
  const borderClass = isDashboard ? "border-red-700" : "border-gray-200";
  const activeBorderClass = isDashboard ? "border-white" : "border-[#B80A00]";
  const hoverBorderClass = isDashboard
    ? "hover:border-gray-200"
    : "hover:border-red-300";

  const navItems = [
    { href: "/dashboard", label: "Beranda" },
    { href: "/review", label: "Ulasan" },
    { href: "/placelist", label: "Daftar Tempat" },
  ];

  return (
    <header className={`${headerBgClass} shadow-md sticky top-0 z-50`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/dashboard">
              <Image
                src={
                  isDashboard
                    ? "/assets/Group-76-1.png"
                    : "/assets/Group-76-3.png"
                }
                alt="MakanGo Logo"
                width={180}
                height={50}
                className="object-contain"
                onError={(e) => {
                  e.currentTarget.src = isDashboard
                    ? "https://placehold.co/180x50/B80A00/FFFFFF?text=MakanGo"
                    : "https://placehold.co/180x50/FFFFFF/B80A00?text=MakanGo";
                  e.currentTarget.alt = "MakanGo Placeholder Logo";
                }}
              />
            </Link>
          </div>

          {/* Navigation Links - Centered for medium and larger screens */}
          <nav className="hidden md:flex flex-grow items-center justify-center space-x-6 lg:space-x-8 px-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative text-sm font-medium ${textColorClass} hover:text-gray-500 transition-all duration-300 pb-1 ${
                  isActiveRoute(item.href)
                    ? `border-b-2 ${activeBorderClass}`
                    : `border-b-2 border-transparent ${hoverBorderClass}`
                }`}
              >
                {item.label}
                {/* Active indicator - alternative animated underline */}
                <span
                  className={`absolute bottom-0 left-0 w-full h-0.5 ${
                    isDashboard ? "bg-white" : "bg-[#B80A00]"
                  } transform origin-left transition-transform duration-300 ${
                    isActiveRoute(item.href) ? "scale-x-100" : "scale-x-0"
                  }`}
                ></span>
              </Link>
            ))}
          </nav>

          {/* Icons - Right side */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Search Icon */}
            <button
              aria-label="Search"
              className={`p-2 ${textColorClass} ${hoverBgClass} rounded-full transition-colors duration-200`}
              onClick={() => console.log("Search icon clicked")}
            >
              <Search size={20} className="sm:w-6 sm:h-6" />
            </button>

            {/* Notification Icon with Badge */}
            <button
              aria-label="Notifications"
              className={`relative p-2 ${textColorClass} ${hoverBgClass} rounded-full transition-colors duration-200`}
              onClick={() => console.log("Notification icon clicked")}
            >
              <Bell size={20} className="sm:w-6 sm:h-6" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 block h-4 w-4 sm:h-5 sm:w-5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75 animate-ping"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 sm:h-5 sm:w-5 bg-yellow-500 text-red-700 text-xs font-bold items-center justify-center">
                    {notificationCount > 9 ? "9+" : notificationCount}
                  </span>
                </span>
              )}
            </button>

            {/* User Profile Dropdown */}
            <div className="relative group">
              <button
                aria-label="User Profile"
                className={`p-2 ${textColorClass} ${hoverBgClass} rounded-full transition-colors duration-200`}
              >
                <User size={20} className="sm:w-6 sm:h-6" />
              </button>

              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-20 transform translate-y-2 group-hover:translate-y-0">
                <div className="absolute -top-2 right-4 w-4 h-4 bg-white transform rotate-45 border-l border-t border-gray-200"></div>
                <Link
                  href="/dashboard/profile/detail"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                >
                  Profil
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                >
                  Keluar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Links - For smaller screens (mobile) */}
        <div className={`md:hidden border-t ${borderClass}`}>
          <div className="flex justify-center space-x-1 py-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-3 py-2 text-sm font-medium ${textColorClass} hover:text-gray-500 transition-all duration-200 rounded-md ${
                  isActiveRoute(item.href)
                    ? isDashboard
                      ? "bg-red-700 bg-opacity-50"
                      : "bg-gray-200"
                    : isDashboard
                    ? "hover:bg-red-700 hover:bg-opacity-30"
                    : "hover:bg-gray-100"
                }`}
              >
                {item.label}
                {/* Mobile active indicator */}
                {isActiveRoute(item.href) && (
                  <span
                    className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4/5 h-0.5 ${
                      isDashboard ? "bg-white" : "bg-[#B80A00]"
                    } rounded-full`}
                  ></span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
