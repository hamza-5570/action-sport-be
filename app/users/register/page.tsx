"use client";

import React, { useState } from "react";
import { registerUser } from "@/lib/actions/users.actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async () => {
    const response = await registerUser({ email, name, password });
    if (response.error) {
      setError(response.error);
    } else {
      setSuccess("User registered successfully!");
      setEmail("");
      setName("");
      setPassword("");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Register</h1>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
      <Input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-4"
      />
      <Input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mb-4"
      />
      <Input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mb-4"
      />
      <Button onClick={handleRegister}>Register</Button>
    </div>
  );
}