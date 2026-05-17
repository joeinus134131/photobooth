import type { Metadata } from "next";
import { Chivo_Mono, DM_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Toaster } from "react-hot-toast";

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
        <ErrorBoundary>
          {children}
          <ServiceWorkerRegister />
          <Toaster 
            position="top-right"
            reverseOrder={false}
            gutter={8}
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1e293b',
                color: '#e2e8f0',
                border: '1px solid #475569',
                borderRadius: '0.5rem',
              },
            }}
          />
        </ErrorBoundary>
      </body>
    </html>
  );
}
