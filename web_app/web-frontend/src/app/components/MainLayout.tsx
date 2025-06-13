"use client";

import Head from "next/head";
import { usePathname } from "next/navigation";
import { useAuth } from "../utils/AuthContext";
import HeaderAuth from "./headerAuth";
import HeaderNonAuth from "./headerNonAuth";
import Footer from "./footer";

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export default function MainLayout({
  children,
  title = "MakanGo",
  description = "Temukan review makanan terbaik!",
}: MainLayoutProps) {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  // Check if current route is dashboard
  const isDashboard = pathname === "/dashboard";

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {loading ? (
        <div className="h-16 bg-white shadow">
          <p className="text-gray-600 text-center pt-4">Loading...</p>
        </div>
      ) : user ? (
        <HeaderAuth />
      ) : (
        <HeaderNonAuth />
      )}

      <main className="flex-grow bg-white">{children}</main>

      {/* Only show footer on dashboard route */}
      {isDashboard && <Footer />}
    </div>
  );
}
