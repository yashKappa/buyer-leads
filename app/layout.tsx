"use client";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Navbar from "./navbar";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const noNavbarRoutes = ["/buyers/new/login", "/buyers/new/register"];

  return (
    <html lang="en">
      <head>
        <title>My App</title>
      </head>
      <body>
        {/* Conditionally render Navbar */}
        {!noNavbarRoutes.includes(pathname) && <Navbar />}

        {/* Main content */}
        {children}

        {/* Collect performance metrics */}
        <SpeedInsights />
      </body>
    </html>
  );
}
