import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EMS — Employee Management System",
  description: "Admin panel for managing employees",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
