/**
 * Isotipo de GUZZO: la llama, con el degradado naranja de la marca.
 * Es un SVG escalable; el tamano se controla con className (h-* w-*).
 */
export function GuzzoFlame({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      role="img"
      aria-label="GUZZO"
    >
      <defs>
        <linearGradient id="guzzoFlame" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fcc00d" />
          <stop offset="50%" stopColor="#f18a00" />
          <stop offset="100%" stopColor="#ed6e1e" />
        </linearGradient>
      </defs>
      <path
        fill="url(#guzzoFlame)"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5Z"
      />
    </svg>
  );
}
