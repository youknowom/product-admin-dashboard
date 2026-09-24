"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { isAuthenticated, getStoredUser, removeStoredToken } from "@/lib/auth";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function ProductsLayout({ children }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      if (!active) return;
      if (!isAuthenticated()) {
        router.replace("/login");
      } else {
        setUser(getStoredUser());
        setAuthorized(true);
      }
    });
    return () => {
      active = false;
    };
  }, [router]);

  const handleLogout = () => {
    removeStoredToken();
    router.replace("/login");
  };

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-zinc-500">Checking authorization...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              href="/products"
              className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2"
            >
              <span className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-sm">
                PA
              </span>
              ProductAdmin
            </Link>

            <nav className="hidden sm:flex items-center gap-4 text-sm font-medium">
              <Link
                href="/products"
                className="text-zinc-600 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Products
              </Link>
              
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            {user && (
              <span className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 hidden sm:inline-block">
                Hi, <span className="font-semibold text-zinc-900 dark:text-zinc-200">{user.firstName || user.username}</span>
              </span>
            )}
            <button
              onClick={handleLogout}
              className="px-3.5 py-1.5 text-xs sm:text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors border border-red-200 dark:border-red-900/50 cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
