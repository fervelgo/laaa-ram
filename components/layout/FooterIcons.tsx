import Link from "next/link";

export function FooterIcons() {
  return (
    <div className="flex items-center gap-4">
      {/* Grid view icon */}
      <button
        className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
        aria-label="Vista de cuadricula"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
        </svg>
      </button>

      {/* Add/Plus icon (admin) */}
      <Link
        href="/admin"
        className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
        aria-label="Agregar objeto"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </Link>
    </div>
  );
}
