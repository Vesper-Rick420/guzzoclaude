import { cn } from "@/lib/utils";
import { GuzzoFlame } from "@/components/guzzo-flame";

/**
 * Logotipo de GUZZO: la palabra con la llama como segunda letra,
 * siguiendo el imagotipo del manual de marca.
 */
export function GuzzoLogo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-heading font-black leading-none tracking-tight text-guzzo-white",
        className,
      )}
    >
      G
      <GuzzoFlame className="mx-[0.03em] h-[1.05em] w-[0.82em]" />
      ZZO
    </span>
  );
}
