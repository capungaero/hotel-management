import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sikabuview - Sistem Manajemen Hotel",
  description: "Sistem manajemen hotel modern dengan TypeScript, Tailwind CSS, dan shadcn/ui.",
  keywords: ["Sikabuview", "Hotel Management", "TypeScript", "Tailwind CSS", "shadcn/ui", "Next.js", "React"],
  authors: [{ name: "Sikabuview Team" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "Sikabuview - Sistem Manajemen Hotel",
    description: "Sistem manajemen hotel modern untuk reservasi dan operasional",
    url: "https://chat.z.ai",
    siteName: "Sikabuview",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sikabuview - Sistem Manajemen Hotel",
    description: "Sistem manajemen hotel modern untuk reservasi dan operasional",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
