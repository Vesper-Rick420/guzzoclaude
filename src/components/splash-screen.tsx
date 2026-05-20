"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { GuzzoLogo } from "@/components/guzzo-logo";

// Posiciones fijas (deterministas) para evitar desajustes de hidratacion.
const PARTICLES = [
  { left: "8%", size: 5, delay: 0.0, duration: 2.4 },
  { left: "16%", size: 3, delay: 0.6, duration: 2.9 },
  { left: "24%", size: 7, delay: 0.2, duration: 2.2 },
  { left: "33%", size: 4, delay: 1.0, duration: 2.7 },
  { left: "41%", size: 6, delay: 0.4, duration: 2.5 },
  { left: "49%", size: 3, delay: 1.3, duration: 3.0 },
  { left: "57%", size: 5, delay: 0.1, duration: 2.3 },
  { left: "65%", size: 4, delay: 0.8, duration: 2.8 },
  { left: "72%", size: 7, delay: 0.3, duration: 2.1 },
  { left: "80%", size: 3, delay: 1.1, duration: 2.9 },
  { left: "88%", size: 5, delay: 0.5, duration: 2.6 },
  { left: "94%", size: 4, delay: 0.9, duration: 2.4 },
  { left: "29%", size: 3, delay: 1.5, duration: 3.1 },
  { left: "61%", size: 4, delay: 1.7, duration: 2.7 },
];

export function SplashScreen() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Si ya se mostro en esta sesion, se oculta de inmediato.
    if (sessionStorage.getItem("guzzo-splash-seen")) {
      setShow(false);
      return;
    }
    const timer = setTimeout(() => {
      sessionStorage.setItem("guzzo-splash-seen", "1");
      setShow(false);
    }, 2600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="splash"
          exit={{ opacity: 0, scale: 1.08 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden bg-guzzo-black"
        >
          {/* Glow pulsante de fondo */}
          <motion.div
            className="absolute h-[420px] w-[420px] rounded-full bg-guzzo-orange/25 blur-[130px]"
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Particulas que suben */}
          {PARTICLES.map((p, i) => (
            <motion.span
              key={i}
              className="absolute bottom-10 rounded-full bg-guzzo-orange"
              style={{ left: p.left, width: p.size, height: p.size }}
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: -420, opacity: [0, 1, 0] }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
          ))}

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative flex flex-col items-center gap-3"
          >
            <GuzzoLogo className="text-6xl drop-shadow-[0_0_30px_rgba(241,138,0,0.55)] sm:text-7xl" />
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-xs uppercase tracking-[0.4em] text-guzzo-orange"
            >
              Date el gusto
            </motion.span>
          </motion.div>

          {/* Barra de carga */}
          <div className="absolute bottom-20 h-1 w-44 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-guzzo-orange to-guzzo-orange-burnt"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2.3, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
