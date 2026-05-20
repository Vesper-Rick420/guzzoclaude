"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden px-6 py-20 text-center">
      {/* Glows decorativos */}
      <div className="pointer-events-none absolute -top-20 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-guzzo-orange/20 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-guzzo-orange-burnt/15 blur-[120px]" />

      <motion.span
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative mb-5 rounded-full border border-guzzo-orange/30 bg-guzzo-orange/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-guzzo-orange"
      >
        Hamburguesas urbanas premium
      </motion.span>

      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="relative font-heading text-5xl font-black leading-[0.95] tracking-tight text-guzzo-white sm:text-7xl"
      >
        Date el gusto
        <br />
        con{" "}
        <span className="bg-gradient-to-r from-guzzo-orange to-guzzo-yellow bg-clip-text text-transparent">
          GUZZO
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative mt-5 max-w-md text-base text-white/60 sm:text-lg"
      >
        Las hamburguesas más antojables de la ciudad, listas en minutos. Pide
        rápido y disfruta.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="relative mt-8"
      >
        <Link
          href="#mas-vendidos"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-guzzo-orange to-guzzo-orange-burnt px-6 py-3 font-semibold text-guzzo-black shadow-lg shadow-guzzo-orange/30 transition-all hover:brightness-110 active:scale-95"
        >
          Ver el menú
          <ArrowRight className="h-4 w-4" />
        </Link>
      </motion.div>
    </section>
  );
}
