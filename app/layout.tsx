import type { Metadata } from "next";
import "./globals.css";
import { SiteShell } from "@/components/layout/SiteShell";

export const metadata: Metadata = {
  title: "Siyo · Creative Developer",
  description:
    "Siyo · Creative coding, frontend engineering, and thoughtful product experiences.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body>
        <div className="app-shell">
          <div className="app-shell__inner">
            <SiteShell>{children}</SiteShell>
          </div>
        </div>
      </body>
    </html>
  );
}
