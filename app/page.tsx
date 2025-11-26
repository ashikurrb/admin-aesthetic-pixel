"use client";

import { useEffect } from "react";
import { useAuth } from "./context/auth";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";

export default function Home() {
  const { auth, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (auth?.token) {
        router.replace("/dashboard");
      } else {
        router.replace("/login");
      }
    }
  }, [loading, auth?.token, router]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-gray-950">
      <Spinner className="w-8 h-8 text-red-600" />
    </div>
  );
}
