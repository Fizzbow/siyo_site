import type { Metadata } from "next";
import "./globals.css";
import { SiteShell } from "@/components/layout/SiteShell";

export const metadata: Metadata = {
  icons: {
    icon: "/favicon.png",
  },
  title: "Siyo · Creative Developer",
  description:
    "Siyo · Creative coding, frontend engineering, and thoughtful product experiences.",
};

import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="app-shell">
            <div className="app-shell__inner">
              <SiteShell>{children}</SiteShell>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
