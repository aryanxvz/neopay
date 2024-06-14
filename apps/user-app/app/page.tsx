"use client"

import { SessionProvider, signIn, signOut, useSession } from "next-auth/react";
import { Appbar } from "../../../packages/ui/src/appbar";

// Create a wrapper component to use SessionProvider
function PageContent() {
  const session = useSession();

  return (
    <div>
      <Appbar onSignin={signIn} onSignout={signOut} user={session.data?.user} />
    </div>
  );
}

export default function Page() {
  return (
    <SessionProvider>
      <PageContent />
    </SessionProvider>
  );
}
