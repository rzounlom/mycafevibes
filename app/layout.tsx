import "./globals.scss";

import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ThemeContext";

export const metadata: Metadata = {
  title: "MyCafeVibes",
  description: "Take a seat and stay awhile with ambient cafe sounds",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
