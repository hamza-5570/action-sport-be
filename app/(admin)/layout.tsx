import React from "react";
import Nav from "./nav";

export const metadata = {
  title: "Admin Dashboard",
  description: "Admin panel for managing the application",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Navigation */}
      <Nav />
      {/* Main Content */}
      <main className="flex-1 p-4 bg-gray-100">{children}</main>
    </div>
  );
}