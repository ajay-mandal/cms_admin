import type { Metadata } from "next";
import { Toaster } from "sonner";

import "./globals.css";

import { ModalProvider } from "@/providers/modal-provider";
import { AuthSessionProvider } from "@/providers/session-provider";

export const metadata: Metadata = {
  title: "CMS Admin",
  description: "Admin panel for store and product management. Single dashboard for multiple store management.",
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: light)",
        url: "/csm-dark.svg",
        href: "/cms-dark.svg"
      },
      {
        media: "(prefers-color-scheme: dark)",
        url: "/cms-light.svg",
        href: "/cms-light.svg"
      }
    ]
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthSessionProvider>
          <ModalProvider />
          <Toaster />
          {children}
        </AuthSessionProvider>
      </body>
    </html>
  );
}
