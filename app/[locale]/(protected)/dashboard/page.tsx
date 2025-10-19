"use client";

import { useSession } from "@/lib/auth-client";
import { Skeleton } from "@/components/ui/skeleton";
import { LogoutButton } from "@/components/auth/button/logout-button";

export default function DashboardPage() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <main className="mx-auto flex h-screen max-w-md flex-col items-center justify-center space-y-4 p-6">
        <Skeleton className="h-8 w-48 rounded-md" /> {/* titre */}
        <Skeleton className="h-6 w-64 rounded-md" /> {/* nom utilisateur */}
        <Skeleton className="h-6 w-56 rounded-md" /> {/* email */}
        <Skeleton className="h-10 w-full rounded-md" /> {/* bouton */}
      </main>
    );
  }

  if (!session?.user) {
    return <p className="mt-8 text-center">Redirecting...</p>;
  }

  const { user } = session;

  return (
    <main className="text-foreground mx-auto flex h-screen max-w-md flex-col items-center justify-center space-y-4 p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p>Welcome, {user.name || "User"}!</p>
      <p>Email: {user.email}</p>
      <LogoutButton>
        <button className="text-foreground w-full rounded-md px-4 py-2 font-medium hover:bg-slate-200">
          Sign Out
        </button>
      </LogoutButton>
    </main>
  );
}
