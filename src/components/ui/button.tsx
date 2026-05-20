import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
};

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex h-12 items-center justify-center rounded-xl px-6 font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" &&
          "bg-gradient-to-r from-guzzo-orange to-guzzo-orange-burnt text-guzzo-black shadow-lg shadow-guzzo-orange/30 hover:brightness-110 hover:shadow-guzzo-orange/50 active:scale-[0.98]",
        variant === "ghost" && "text-white/70 hover:text-guzzo-orange",
        className,
      )}
      {...props}
    />
  );
}
