"use client";

import Navbar from "./navbar";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const noNavbarRoutes = ["/buyers/new/login","/buyers/new/register"];

  return (
    <html lang="en">
      <body>
        {!noNavbarRoutes.includes(pathname) && <Navbar />}
        {children}
      </body>
    </html>
  );
}
