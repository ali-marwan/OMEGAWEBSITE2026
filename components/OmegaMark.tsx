type Props = {
  className?: string;
  size?: number;
};

/**
 * The square OMEGA emblem extracted from the brand logo:
 * a square frame with vertical, horizontal and two diagonal rules
 * intersecting at center — used as a compact brand mark.
 */
export function OmegaMark({ className = "", size = 28 }: Props) {
  return (
    <svg
      viewBox="0 0 102 102"
      width={size}
      height={size}
      className={className}
      aria-label="OMEGA"
      role="img"
    >
      <g
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="square"
        fill="none"
      >
        <rect x="3" y="3" width="96" height="96" />
        <line x1="3" y1="51" x2="99" y2="51" />
        <line x1="51" y1="3" x2="51" y2="99" />
        <line x1="3" y1="3" x2="99" y2="99" />
        <line x1="99" y1="3" x2="3" y2="99" />
      </g>
    </svg>
  );
}
