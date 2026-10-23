type Props = {
  color?: string;
  className?: string;
  title?: string;
};

// Silhouette de teckel stylisée, utilisée comme illustration un peu partout.
export function Teckel({ color = "#b5652b", className, title }: Props) {
  return (
    <svg
      viewBox="0 0 200 90"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      <path d="M44 42 Q26 36 16 18" stroke={color} strokeWidth="7" strokeLinecap="round" fill="none" />
      <rect x="48" y="54" width="10" height="26" rx="5" fill={color} />
      <rect x="62" y="54" width="10" height="24" rx="5" fill={color} opacity="0.75" />
      <rect x="126" y="54" width="10" height="26" rx="5" fill={color} />
      <rect x="140" y="54" width="10" height="24" rx="5" fill={color} opacity="0.75" />
      <rect x="38" y="32" width="118" height="34" rx="17" fill={color} />
      <path d="M140 40 Q148 20 160 16 L170 34 Q160 44 150 52 Z" fill={color} />
      <circle cx="164" cy="26" r="15" fill={color} />
      <rect x="164" y="22" width="30" height="15" rx="7.5" fill={color} />
      <ellipse cx="156" cy="34" rx="7" ry="14" fill="black" opacity="0.22" transform="rotate(12 156 34)" />
      <circle cx="171" cy="22" r="2.4" fill="#2a1d14" />
      <circle cx="193" cy="28" r="3.6" fill="#2a1d14" />
    </svg>
  );
}
