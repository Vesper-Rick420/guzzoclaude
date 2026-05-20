export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 bg-guzzo-black px-6 text-center">
      <span className="text-sm font-medium uppercase tracking-[0.3em] text-guzzo-orange">
        Menú Digital
      </span>
      <h1 className="text-6xl font-black tracking-tight text-guzzo-white sm:text-8xl">
        GUZZO
      </h1>
      <p className="max-w-md text-lg text-white/60">
        Date el gusto. Estamos preparando algo delicioso.
      </p>
      <div className="h-1 w-24 rounded-full bg-gradient-to-r from-guzzo-orange to-guzzo-orange-burnt" />
    </main>
  );
}
