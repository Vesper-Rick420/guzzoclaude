import type { Metadata } from "next";
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
    <html lang="es" className={`${jost.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <SplashScreen />
        {children}
        <Toaster theme="dark" position="top-center" richColors />
      </body>
    </html>
  );
}
