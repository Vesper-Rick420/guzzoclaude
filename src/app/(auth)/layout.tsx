import Link from "next/link";
import { GuzzoLogo } from "@/components/guzzo-logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-guzzo-black px-4 py-10">
      {/* Glows decorativos */}
      <div className="pointer-events-none absolute -top-32 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-guzzo-orange/25 blur-[110px]" />
      <div className="pointer-events-none absolute bottom-0 right-8 h-72 w-72 rounded-full bg-guzzo-orange-burnt/15 blur-[110px]" />

      <div className="relative flex w-full max-w-md flex-col items-center gap-6">
        <Link href="/" className="flex flex-col items-center gap-1">
          <GuzzoLogo className="text-4xl" />
          <span className="text-[0.7rem] uppercase tracking-[0.3em] text-guzzo-orange">
            Menu Digital
          </span>
        </Link>
        {children}
      </div>
    </div>
  );
}
