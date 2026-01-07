import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google"; // Replacing with Poppins for that premium feel as per plan, or stick to Geist. Poppins is nice for titles.
// Let's use flexible fonts. I'll stick to Geist for now but maybe import a Google font like Outfit or Poppins.
import { Outfit } from "next/font/google";
import "./globals.css";
import { MainLayout } from "@/components/layout/main-layout";
import { Toaster } from "@/components/ui/sonner";
import Script from "next/script";
// Using Outfit for a modern, clean, premium look
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Kelas Santai | Belajar Tanpa Buru-buru",
  description: "Platform belajar online premium dengan suasana santai dan mentor berpengalaman.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${outfit.variable} font-sans antialiased bg-background text-foreground min-h-screen flex flex-col`}
      >
        <MainLayout>
          {children}
        </MainLayout>
        <Toaster position="top-right" />
        <Script className="z-9999"
          src={process.env.NEXT_PUBLIC_MIDTRANS_SNAP_URL || "https://app.midtrans.com/snap/snap.js"}
          data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || ""}
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}

