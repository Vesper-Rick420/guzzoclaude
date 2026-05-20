import type { Metadata, Viewport } from "next";
import { Jost } from "next/font/google";
import { Toaster } from "sonner";
import { SplashScreen } from "@/components/splash-screen";
import "./globals.css";

// Jost: alternativa libre y geometrica a Futura, la tipografia de marca.
const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const description =
  "Menú digital interactivo de GUZZO. Hamburguesas urbanas premium, combos y más. Pide rápido y date el gusto.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "GUZZO — Date el gusto",
  description,
  applicationName: "GUZZO",
  keywords: [
    "GUZZO",
    "hamburguesas",
    "comida rápida",
    "menú digital",
    "combos",
    "delivery",
  ],
  authors: [{ name: "GUZZO" }],
  openGraph: {
    title: "GUZZO — Date el gusto",
    description,
    siteName: "GUZZO",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GUZZO — Date el gusto",
    description,
  },
};

export const viewport: Viewport = {
  themeColor: "#010101",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${jost.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <SplashScreen />
        {children}
        <Toaster theme="dark" position="top-center" richColors />
      </body>
    </html>
  );
}
