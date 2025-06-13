"use client";

import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";

export default function HeaderNonAuth() {
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get("search") as string;
    console.log("Search query:", query);
  };

  return (
    <header className="bg-[#B80A00] shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/dashboard">
              <Image
                src="/assets/Group-76-1.png"
                alt="MakanGo Logo"
                width={180}
                height={50}
                className="object-contain"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://placehold.co/180x50/B80A00/FFFFFF?text=MakanGo";
                  e.currentTarget.alt = "MakanGo Placeholder Logo";
                }}
              />
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-grow items-center justify-center px-4 lg:px-8">
            <form onSubmit={handleSearch} className="relative w-full max-w-lg">
              <input
                type="search"
                name="search"
                placeholder="Cari Makanan, Restoran, dll."
                className="w-full pl-5 pr-12 py-2.5 border bg-white border-gray-300 rounded-full text-sm text-black focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 bottom-0 bg-red-600 hover:bg-red-700 text-white px-4 rounded-r-full flex items-center justify-center"
                aria-label="Search"
              >
                <Search size={20} />
              </button>
            </form>
          </div>

          {/* Login/Register Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Link
              href="/auth/login"
              className="px-3 sm:px-4 py-2 text-sm font-medium text-white hover:text-gray-200 transition-colors"
            >
              Masuk
            </Link>
            <Link
              href="/auth/register"
              className="px-3 sm:px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-full transition-colors"
            >
              Daftar
            </Link>
          </div>
        </div>

        {/* Search Bar - Mobile */}
        <div className="md:hidden pb-3 px-1">
          <form onSubmit={handleSearch} className="relative w-full">
            <input
              type="search"
              name="search"
              placeholder="Cari Makanan..."
              className="w-full pl-5 pr-12 py-2.5 border border-gray-300 rounded-full text-sm text-gray-700 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
            />
            <button
              type="submit"
              className="absolute right-0 top-0 bottom-0 bg-red-600 hover:bg-red-700 text-white px-4 rounded-full flex items-center justify-center"
              aria-label="Search"
            >
              <Search size={20} />
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
