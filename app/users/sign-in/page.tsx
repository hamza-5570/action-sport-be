"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react"; // Importer signIn de NextAuth
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false, // Empêche la redirection automatique
    });
    console.log("result",result)

    if (result?.error) {
      setError(result.error);
    } else {
      // Actualiser la page ou rediriger après connexion réussie
      window.location.href = "/";
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Login</h1>
      {error && <p className="text-red-500">{error}</p>}
      <Input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-4"
      />
      <Input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mb-4"
      />
      <Button onClick={handleLogin}>Login</Button>
    </div>
  );
}