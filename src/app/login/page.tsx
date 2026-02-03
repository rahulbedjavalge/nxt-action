"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 max-w-md w-full mx-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
          <span className="text-blue-600 dark:text-blue-400">Nxt</span> Action
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
          Sign in to access your tasks
        </p>
        <Button
          size="lg"
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="w-full"
        >
          🔐 Sign in with Google
        </Button>
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
          Only the owner can sign in
        </p>
      </div>
    </div>
  );
}
