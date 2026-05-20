import { GuzzoLogo } from "@/components/guzzo-logo";

export default function Home() {
  return (
    <section className="relative flex flex-1 flex-col items-center justify-center gap-6 overflow-hidden px-6 py-24 text-center">
      <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-guzzo-orange/15 blur-[130px]" />

      <span className="relative text-sm font-medium uppercase tracking-[0.3em] text-guzzo-orange">
        Bienvenido
      </span>
      <GuzzoLogo className="relative text-7xl sm:text-8xl" />
      <p className="relative max-w-md text-lg text-white/60">
        Estamos preparando el menu mas antojable de la ciudad. Muy pronto vas a
        poder pedir aqui mismo.
      </p>
    </section>
  );
}
