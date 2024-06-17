"use client";
import { SessionProvider, signIn, signOut, useSession } from "next-auth/react";
import { Appbar } from "../../../packages/ui/src/Appbar";
import { useRouter } from "next/navigation";
import React from "react";

function AppbarClientContent() {
  const session = useSession();
  const router = useRouter();

  return (
    <div>
      <Appbar
        onSignin={signIn}
        onSignout={async () => {
          await signOut();
          router.push("/api/auth/signin");
        }}
        user={session.data?.user}
      />
    </div>
  );
}

export function AppbarClient() {
  return (
    <SessionProvider>
      <AppbarClientContent />
    </SessionProvider>
  );
}
