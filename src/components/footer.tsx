import Link from "next/link";
import { GuzzoLogo } from "@/components/guzzo-logo";

const MENU_LINKS = [
  { label: "Combos", href: "/menu/combos" },
  { label: "Hamburguesas", href: "/menu/hamburguesas" },
  { label: "Gaseosas", href: "/menu/gaseosas" },
  { label: "Extras", href: "/menu/extras" },
];

const SOCIAL_LINKS = ["Instagram", "Facebook", "WhatsApp"];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-guzzo-black">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-3">
            <GuzzoLogo className="text-2xl" />
            <p className="text-sm leading-relaxed text-white/40">
              Hamburguesas urbanas premium. Rapidez, sabor y experiencia. Date
              el gusto.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-guzzo-orange">
              Menu
            </h3>
            <ul className="flex flex-col gap-2">
              {MENU_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-white/50 transition-colors hover:text-guzzo-orange"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-guzzo-orange">
              Contacto
            </h3>
            <ul className="flex flex-col gap-2 text-sm text-white/50">
              <li>Lunes a Domingo</li>
              <li>11:00 - 23:00</li>
              <li>contacto@guzzo.com</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-guzzo-orange">
              Siguenos
            </h3>
            <ul className="flex flex-col gap-2">
              {SOCIAL_LINKS.map((s) => (
                <li key={s}>
                  <a
                    href="#"
                    className="text-sm text-white/50 transition-colors hover:text-guzzo-orange"
                  >
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/5 pt-6 text-center text-xs text-white/30">
          (c) 2026 GUZZO. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
