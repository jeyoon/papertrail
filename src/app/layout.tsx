import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { MuiProvider } from "@/lib/mui-theme";

export const metadata: Metadata = {
  title: "Papertrail",
  description: "Flyer distribution and engagement tracking",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <MuiProvider>
          {children}
          <Toaster />
        </MuiProvider>
      </body>
    </html>
  );
}
