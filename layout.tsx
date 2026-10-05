import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteShell } from "@/components/SiteShell";
import "./globals.css";

export const metadata: Metadata = {
  title: "LINE / FORM — The Architect's Sketchbook",
  description: "A premium architecture sketchbook for architects, designers and creative minds who turn ideas into spaces.",
  openGraph: {
    title: "LINE / FORM — The Architect's Sketchbook",
    description: "A considered space for the things that don't exist yet.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-IN">
      <body><SiteShell>{children}</SiteShell></body>
    </html>
  );
}
