"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoginForm from "@/components/auth/LoginForm";
import { isAuthenticated } from "@/lib/auth";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function LoginPage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      if (!active) return;
      if (isAuthenticated()) {
        router.replace("/products");
      } else {
        setCheckingAuth(false);
      }
    });
    return () => {
      active = false;
    };
  }, [router]);

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4 py-12 relative">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>
      <LoginForm />
    </div>
  );
}
