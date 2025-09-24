import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/components/session-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PAAM FinTech Platform - Enterprise SDK for Financial Applications",
  description: "Enterprise-grade mobile SDK for financial applications. Integrate KYC/AML verification, payment processing, and compliance monitoring in minutes.",
  keywords: ["PAAM", "FinTech", "SDK", "KYC", "AML", "Payment Processing", "Compliance", "Financial Technology"],
  authors: [{ name: "PAAM Team" }],
  openGraph: {
    title: "PAAM FinTech Platform",
    description: "Enterprise-grade SDK for financial applications",
    url: "https://paam-fintech.com",
    siteName: "PAAM FinTech",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PAAM FinTech Platform",
    description: "Enterprise-grade SDK for financial applications",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
