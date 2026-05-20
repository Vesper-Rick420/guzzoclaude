import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-guzzo-white outline-none transition-all duration-200 placeholder:text-white/30 focus:border-guzzo-orange focus:bg-white/10 focus:ring-2 focus:ring-guzzo-orange/30",
        className,
      )}
      {...props}
    />
  );
}

/** Campo con etiqueta + input. Reduce repeticion en los formularios. */
export function Field({ label, ...props }: InputProps & { label: string }) {
  const id = props.id ?? props.name;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-white/70">
        {label}
      </label>
      <Input id={id} {...props} />
    </div>
  );
}
