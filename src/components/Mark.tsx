/**
 * Monogramme : une chouette stylisée, tissée de deux fils de chaîne
 * et d'une trame — jamais une illustration littérale.
 */
export function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" focusable="false">
      <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <path d="M9 5v22M23 5v22" />
        <path d="M4 14c4 0 5-4 12-4s8 4 12 4" />
      </g>
      <circle cx="12.5" cy="17.5" r="2.4" fill="currentColor" />
      <circle cx="19.5" cy="17.5" r="2.4" className="mark-eye" />
    </svg>
  );
}
