import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";

import "./globals.css";

import { ModalProvider } from "@/providers/modal-provider";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <html lang="en">
        <body>
          <ModalProvider />
          <Toaster />
          {children}
        </body>
      </html>
    </SessionProvider>
  );
}
