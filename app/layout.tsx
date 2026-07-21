import type { Metadata } from "next";
import { Montserrat, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Klick",
    default: "Klick - Modern Link Shortener & Analytics",
  },
  description: "A fast, beautifully designed, and privacy-focused URL shortener with real-time analytics.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000")),
  openGraph: {
    title: "Klick - Modern Link Shortener",
    description: "Shorten links and track engagement in real-time with Klick's beautifully designed dashboard.",
    url: "/",
    siteName: "Klick",
    images: [
      {
        url: "/klick-logo.png", // Next.js will automatically serve this from the public folder
        width: 1200,
        height: 630,
        alt: "Klick Preview Image",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Klick - Modern Link Shortener",
    description: "Shorten links and track engagement in real-time with Klick.",
    images: ["/klick-logo.png"],
  },
  icons: {
    icon: "/klick-logo.png",
    shortcut: "/klick-logo.png",
    apple: "/klick-logo.png",
  },
};

import { TooltipProvider } from "@/components/ui/tooltip";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", montserrat.variable, "font-sans", geist.variable)}
    >
      <body className=" flex flex-col">
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
