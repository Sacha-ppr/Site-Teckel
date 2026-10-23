// Le teckel et ses vêtements en SVG, dans un repère commun (viewBox 0 0 420 260, chien tourné vers la droite).
// Les vêtements sont des calques posés dans un ordre fixe : corps, haut, pattes avant, harnais, tête, cou, lunettes, chapeau.

import type { Coat, GarmentId, Look } from "@/lib/dress-up";

export const VIEWBOX = "0 0 420 260";

const PALETTES: Record<Coat, { base: string; shade: string; tan?: string; dark: string }> = {
  fauve: { base: "#c46f2c", shade: "#9a521f", dark: "#2a1a10" },
  "noir-feu": { base: "#231c18", shade: "#120d0a", tan: "#b4652a", dark: "#050403" },
  "poil-long": { base: "#8a4f25", shade: "#663718", dark: "#24140a" },
};

// Silhouette du tronc et du cou : sert de masque aux hauts et au harnais.
const TORSO = "M111 104 H279 C290 92 302 78 316 70 L348 96 C338 122 322 142 306 154 L304 182 H111 A39 39 0 0 1 111 104 Z";

type Props = { coat: Coat; look: Look; uid: string };

export function TeckelFigure({ coat, look, uid }: Props) {
  const p = PALETTES[coat];
  const long = coat === "poil-long";
  return (
    <g>
      <TorsoClip uid={uid} />
      {/* Ombre au sol */}
      <ellipse cx="200" cy="236" rx="150" ry="9" fill="#000" opacity="0.18" />

      {/* Queue */}
      {long ? (
        <path d="M86 124 C64 116 46 98 36 74 C50 86 58 84 52 96 C66 104 74 98 72 110 C80 114 86 114 90 120 Z" fill={p.base} />
      ) : (
        <path d="M86 126 C62 118 46 100 36 78" stroke={p.base} strokeWidth="12" strokeLinecap="round" fill="none" />
      )}

      {/* Pattes arrière-plan, un ton plus sombre */}
      <rect x="112" y="158" width="20" height="68" rx="10" fill={p.shade} />
      <rect x="264" y="158" width="20" height="68" rx="10" fill={p.shade} />

      {/* Corps et cou */}
      <path d={TORSO} fill={p.base} />
      {long ? (
        <path
          d="M104 176 C112 196 120 184 128 198 C136 186 146 200 154 188 C162 200 172 188 180 198 C188 186 198 200 206 188 C214 200 224 188 232 198 C240 186 250 200 258 188 C266 198 276 190 290 182 L290 170 L104 170 Z"
          fill={p.base}
        />
      ) : null}
      {p.tan ? <path d="M300 150 C310 160 318 156 322 140 C314 146 306 148 300 150 Z" fill={p.tan} /> : null}

      {look.haut ? <Garment id={look.haut} uid={uid} /> : null}

      {/* Pattes avant-plan */}
      <Leg x={94} fill={p.base} tan={p.tan} />
      <Leg x={284} fill={p.base} tan={p.tan} />

      {look.harnais ? <Garment id={look.harnais} uid={uid} /> : null}

      {/* Tête */}
      <circle cx="330" cy="86" r="38" fill={p.base} />
      <path d="M342 72 C370 70 396 82 404 96 C409 106 400 116 386 116 L344 114 Z" fill={p.base} />
      {p.tan ? (
        <>
          <path d="M348 104 C364 112 382 116 396 112 C390 118 370 120 352 116 Z" fill={p.tan} />
          <ellipse cx="356" cy="70" rx="6" ry="3.6" fill={p.tan} />
        </>
      ) : null}
      {long ? <path d="M384 114 C388 124 376 128 372 120 C366 128 356 124 356 116 Z" fill={p.shade} /> : null}
      <circle cx="403" cy="99" r="7.5" fill={p.dark} />
      <path d="M386 112 C380 116 372 116 366 113" stroke={p.dark} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <circle cx="352" cy="80" r="5.2" fill={p.dark} />
      <circle cx="353.8" cy="78.4" r="1.6" fill="#fff" />

      {/* Oreille */}
      {long ? (
        <path
          d="M318 64 C296 68 286 100 290 132 C292 150 300 158 306 150 C310 160 320 156 320 146 C328 150 332 140 326 128 C330 106 332 82 318 64 Z"
          fill={p.shade}
        />
      ) : (
        <path d="M318 64 C298 68 290 100 294 128 C298 146 316 146 322 128 C326 108 330 84 318 64 Z" fill={p.shade} />
      )}

      {look.cou ? <Garment id={look.cou} uid={uid} /> : null}
      {look.lunettes ? <Garment id={look.lunettes} uid={uid} /> : null}
      {look.chapeau ? <Garment id={look.chapeau} uid={uid} /> : null}
    </g>
  );
}

function Leg({ x, fill, tan }: { x: number; fill: string; tan?: string }) {
  return (
    <g>
      <rect x={x} y="160" width="22" height="68" rx="11" fill={fill} />
      <ellipse cx={x + 15} cy="228" rx="15" ry="6.5" fill={tan ?? fill} />
    </g>
  );
}

function TorsoClip({ uid }: { uid: string }) {
  return (
    <defs>
      <clipPath id={`${uid}-torse`}>
        <path d={TORSO} />
      </clipPath>
      <pattern id={`${uid}-rayures`} width="12" height="13" patternUnits="userSpaceOnUse">
        <rect width="12" height="13" fill="#f7f5f0" />
        <rect y="7" width="12" height="6" fill="#1f3a5f" />
      </pattern>
      <pattern id={`${uid}-matelasse`} width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <rect width="22" height="22" fill="#24344d" />
        <path d="M0 0H22M0 0V22" stroke="#3b5274" strokeWidth="2" />
      </pattern>
      <pattern id={`${uid}-torsades`} width="20" height="20" patternUnits="userSpaceOnUse">
        <rect width="20" height="20" fill="#e9dcc3" />
        <path d="M4 0 C14 5 14 15 4 20 M14 0 C4 5 4 15 14 20" stroke="#c7b48f" strokeWidth="2.4" fill="none" />
      </pattern>
    </defs>
  );
}

// Un vêtement seul, dans le même repère que le chien.
export function Garment({ id, uid }: { id: GarmentId; uid: string }) {
  const clip = `url(#${uid}-torse)`;
  switch (id) {
    case "mariniere":
      return (
        <g clipPath={clip}>
          <rect x="132" y="60" width="230" height="130" fill={`url(#${uid}-rayures)`} />
          <rect x="132" y="60" width="8" height="130" fill="#e3ded3" />
        </g>
      );
    case "manteau":
      return (
        <g>
          <g clipPath={clip}>
            <rect x="104" y="60" width="200" height="132" fill={`url(#${uid}-matelasse)`} />
            <rect x="104" y="168" width="200" height="20" fill="#1a2639" />
          </g>
          {/* Col en fausse fourrure */}
          <path d="M284 92 C296 84 306 76 312 72 L322 86 C312 94 302 104 292 110 Z" fill="#efe6d4" />
        </g>
      );
    case "pull-torsade":
      return (
        <g>
          <g clipPath={clip}>
            <rect x="132" y="60" width="230" height="130" fill={`url(#${uid}-torsades)`} />
            <rect x="132" y="60" width="10" height="130" fill="#d6c6a6" />
          </g>
          {/* Col roulé côtelé */}
          <path d="M300 78 L326 66 L346 96 L322 110 Z" fill="#d6c6a6" />
          <path d="M306 76 L330 106 M314 72 L338 102" stroke="#c0ad88" strokeWidth="2" />
        </g>
      );
    case "harnais":
      return (
        <g>
          <g clipPath={clip}>
            <rect x="196" y="98" width="11" height="90" rx="4" fill="#6b3b1f" />
            <rect x="284" y="98" width="11" height="90" rx="4" fill="#6b3b1f" transform="rotate(-18 290 140)" />
            <rect x="196" y="101" width="96" height="10" rx="4" fill="#6b3b1f" />
          </g>
          <circle cx="246" cy="104" r="7" fill="none" stroke="#b9bcc0" strokeWidth="3.5" />
          <rect x="194" y="150" width="15" height="11" rx="2" fill="none" stroke="#b9bcc0" strokeWidth="2.5" />
        </g>
      );
    case "foulard":
      return (
        <g>
          {/* Liseré clair : le foulard rouge reste lisible sur le rideau rouge. */}
          <path d="M302 124 C318 128 334 122 348 108 L326 170 Z" fill="#d81e3a" stroke="#f7f5f0" strokeWidth="3" strokeLinejoin="round" />
          <path d="M300 122 C318 128 336 120 350 106" stroke="#f7f5f0" strokeWidth="9" fill="none" strokeLinecap="round" />
          <path d="M300 122 C318 128 336 120 350 106" stroke="#d81e3a" strokeWidth="5" fill="none" strokeLinecap="round" />
          <circle cx="322" cy="136" r="3" fill="#f7f5f0" />
          <circle cx="335" cy="130" r="3" fill="#f7f5f0" />
          <circle cx="327" cy="150" r="3" fill="#f7f5f0" />
        </g>
      );
    case "noeud":
      return (
        <g>
          <path d="M322 142 L306 132 L308 154 Z" fill="#111" />
          <path d="M322 142 L338 132 L336 154 Z" fill="#111" />
          <rect x="317" y="137" width="10" height="11" rx="3" fill="#2a2a2a" />
        </g>
      );
    case "lunettes":
      return (
        <g>
          <path d="M344 78 L320 76" stroke="#111" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="356" cy="81" r="12.5" fill="#111" stroke="#2a2a2a" strokeWidth="2.5" />
          <path d="M349 75 C352 72 357 71 361 73" stroke="#fff" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7" />
          <path d="M368 80 L376 84" stroke="#111" strokeWidth="3" strokeLinecap="round" />
        </g>
      );
    case "beret":
      return (
        <g>
          <ellipse cx="326" cy="52" rx="38" ry="13" transform="rotate(-12 326 52)" fill="#1a1a1a" />
          <path d="M318 42 C320 36 324 32 330 30" stroke="#1a1a1a" strokeWidth="4" strokeLinecap="round" fill="none" />
        </g>
      );
    case "casquette":
      return (
        <g>
          <path d="M296 64 C296 36 350 30 362 58 Z" fill="#2c4a6b" />
          <path d="M356 54 C374 50 392 54 400 62 C388 66 370 64 354 62 Z" fill="#1d3550" />
          <circle cx="330" cy="38" r="3.5" fill="#1d3550" />
          <path d="M330 40 C330 48 328 56 326 62" stroke="#1d3550" strokeWidth="1.6" fill="none" />
        </g>
      );
  }
}

// Vignette d'un vêtement pour le dressing.
export function GarmentIcon({ id, box, uid }: { id: GarmentId; box: string; uid: string }) {
  return (
    <svg viewBox={box} className="h-full w-full" aria-hidden>
      <TorsoClip uid={uid} />
      <Garment id={id} uid={uid} />
    </svg>
  );
}
