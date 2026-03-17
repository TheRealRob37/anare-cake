"use client";

// Renders the public Header + Footer only on non-staff routes.
// Staff pages have their own isolated headers.

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

export default function PublicShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isStaff = pathname.startsWith("/staff");

  return (
    <>
      {!isStaff && <Header />}
      <main>{children}</main>
      {!isStaff && <Footer />}
    </>
  );
}
