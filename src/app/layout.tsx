import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import { Toaster } from "sonner";
import { SplashScreen } from "@/components/splash-screen";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Fuente de titulos: geometrica y gruesa, estilo Futura/Bogart.
const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "GUZZO — Date el gusto",
  description:
    "Menú digital interactivo de GUZZO. Hamburguesas urbanas premium, combos y más. Pide rápido y date el gusto.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SplashScreen />
        {children}
        <Toaster theme="dark" position="top-center" richColors />
      </body>
    </html>
  );
}
