import { cn } from "@/lib/utils";

/** Logotipo tipografico temporal de GUZZO (placeholder hasta tener el logo oficial). */
export function GuzzoLogo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "font-heading font-black tracking-tight text-guzzo-white",
        className,
      )}
    >
      GU<span className="text-guzzo-orange">Z</span>ZO
    </span>
  );
}
