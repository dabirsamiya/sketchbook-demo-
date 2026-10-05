"use client";

import type { ReactNode } from "react";
import { StorefrontProvider } from "@/components/StorefrontProvider";
import { Header } from "@/components/Header";
import { CartDrawer } from "@/components/CartDrawer";
import { Footer } from "@/components/Footer";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <StorefrontProvider>
      <Header />
      {children}
      <Footer />
      <CartDrawer />
    </StorefrontProvider>
  );
}
