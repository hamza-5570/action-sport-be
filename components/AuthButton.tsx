"use client";
import { useSession, signIn, signOut } from "next-auth/react";

export default function AuthButton() {
  const { data: session } = useSession();

  return (
    <div>
      {session ? (
        <div>
          <p>Welcome {session.user?.name}</p>
          <button onClick={() => signOut()}>Sign out</button>
        </div>
      ) : (
        <div>
          <button onClick={() => signIn("google")}>Sign in with Google</button>
          <button
            onClick={() => signIn("credentials", { email: "", password: "" })}
          >
            Sign in with Email
          </button>
        </div>
      )}
    </div>
  );
}
