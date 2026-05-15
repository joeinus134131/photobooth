import type { Metadata } from "next";
import { Chivo_Mono, DM_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";

const displayFont = Chivo_Mono({
  subsets: ["latin"],
  variable: "--font-display",
});

const bodyFont = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Photobooth App",
  description: "A retro-style photobooth experience in your browser.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Photobooth",
    statusBarStyle: "default",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-stone-100 font-sans antialiased",
          displayFont.variable,
          bodyFont.variable
        )}
      >
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
