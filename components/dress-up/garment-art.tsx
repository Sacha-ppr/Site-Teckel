// Les vêtements de la cabine d'essayage en SVG, dessinés dans le repère d'un gabarit de teckel
// (viewBox 0 0 420 260, tête à droite). Rendu « matière » : volume, textures de tissu, coutures, ombres.
// Posés sur une photo détourée, les hauts et le harnais sont découpés par la vraie silhouette du chien.

import type { GarmentId } from "@/lib/dress-up";

// Silhouette du tronc et du cou du gabarit : sert de masque aux hauts et au harnais
// quand aucune photo détourée ne donne la vraie silhouette.
const TORSO = "M111 104 H279 C290 92 302 78 316 70 L348 96 C338 122 322 142 306 154 L304 182 H111 A39 39 0 0 1 111 104 Z";

// Bord avant d'un haut porté sur une photo : il s'arrête au poitrail.
const FRONT = "M316 88 C321 112 320 140 306 162";

// Zone d'un haut posé sur une photo : du dos jusqu'au ventre, le bas remonte avant les pattes avant.
const AMPLE = "M96 88 H316 C321 112 320 140 306 162 C280 178 220 182 160 180 C126 179 104 176 96 172 Z";

export type Fit = "gabarit" | "photo";

// Textures et effets partagés par tous les vêtements d'une scène.
function SharedDefs({ uid }: { uid: string }) {
  const id = (name: string) => `${uid}-${name}`;
  return (
    <defs>
      <clipPath id={id("torse")}>
        <path d={TORSO} />
      </clipPath>
      {/* Ourlet arrière arrondi : le vêtement suit la croupe au lieu de s'arrêter net. */}
      {/* Zone large d'un haut posé sur une photo : la silhouette réelle du chien fait le reste. */}
      <clipPath id={id("ample")}>
        <path d={AMPLE} />
      </clipPath>
      <clipPath id={id("ourlet")}>
        <path d="M150 88 C134 116 132 160 146 198 H420 V60 H150 Z" />
      </clipPath>
      <clipPath id={id("ourlet-long")}>
        <path d="M118 88 C102 116 100 160 114 198 H420 V60 H118 Z" />
      </clipPath>
      <filter id={id("flou")} x="-10%" y="-50%" width="120%" height="200%">
        <feGaussianBlur stdDeviation="3" />
      </filter>
      {/* Ombre douce d'un vêtement posé sur le pelage */}
      <filter id={id("pose")} x="-10%" y="-10%" width="120%" height="130%">
        <feDropShadow dx="0" dy="2.5" stdDeviation="2" floodColor="#000" floodOpacity="0.35" />
      </filter>
      {/* Volume d'un tronc cylindrique : lumière sur le dos, ombre sous le ventre */}
      <linearGradient id={id("volume")} x1="0" y1="96" x2="0" y2="190" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#fff" stopOpacity="0.32" />
        <stop offset="0.3" stopColor="#fff" stopOpacity="0" />
        <stop offset="0.62" stopColor="#000" stopOpacity="0" />
        <stop offset="1" stopColor="#000" stopOpacity="0.42" />
      </linearGradient>
      {/* Matelassage : chaque boudin est bombé */}
      <linearGradient id={id("boudin")} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#141e2e" />
        <stop offset="0.5" stopColor="#3d5884" />
        <stop offset="1" stopColor="#141e2e" />
      </linearGradient>
      <pattern id={id("matelasse")} width="19" height="200" patternUnits="userSpaceOnUse">
        <rect width="19" height="200" fill={`url(#${id("boudin")})`} />
      </pattern>
      {/* Maille torsadée : deux brins qui se croisent, en relief */}
      <pattern id={id("torsades")} width="26" height="22" patternUnits="userSpaceOnUse">
        <rect width="26" height="22" fill="#e9ddc5" />
        <rect x="0" width="4" height="22" fill="#d9caa9" />
        <path d="M8 0 C20 6 20 16 8 22" stroke="#b7a37c" strokeWidth="4.2" fill="none" />
        <path d="M8 0 C20 6 20 16 8 22" stroke="#f6eedd" strokeWidth="1.6" fill="none" />
        <path d="M20 0 C8 6 8 16 20 22" stroke="#b7a37c" strokeWidth="4.2" fill="none" />
        <path d="M20 0 C8 6 8 16 20 22" stroke="#f6eedd" strokeWidth="1.6" fill="none" />
      </pattern>
      {/* Côtes de tricot */}
      <pattern id={id("cotes")} width="4" height="4" patternUnits="userSpaceOnUse">
        <rect width="4" height="4" fill="#ddd0b4" />
        <rect width="1.6" height="4" fill="#c2b08b" />
      </pattern>
      <pattern id={id("cotes-blanc")} width="4" height="4" patternUnits="userSpaceOnUse">
        <rect width="4" height="4" fill="#f4f1ea" />
        <rect width="1.4" height="4" fill="#d5d0c4" />
      </pattern>
      <linearGradient id={id("cuir")} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#4b2812" />
        <stop offset="0.5" stopColor="#8a5129" />
        <stop offset="1" stopColor="#4b2812" />
      </linearGradient>
      <linearGradient id={id("cuir-h")} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#8a5129" />
        <stop offset="1" stopColor="#4b2812" />
      </linearGradient>
      <linearGradient id={id("metal")} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#f2f3f4" />
        <stop offset="0.5" stopColor="#9a9ea3" />
        <stop offset="1" stopColor="#d9dbde" />
      </linearGradient>
      <pattern id={id("pois")} width="12" height="12" patternUnits="userSpaceOnUse">
        <rect width="12" height="12" fill="#c8102e" />
        <circle cx="3" cy="3" r="1.9" fill="#fbf7ef" />
        <circle cx="9" cy="9" r="1.9" fill="#fbf7ef" />
      </pattern>
      <linearGradient id={id("pli")} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity="0.25" />
        <stop offset="0.45" stopColor="#fff" stopOpacity="0" />
        <stop offset="1" stopColor="#000" stopOpacity="0.4" />
      </linearGradient>
      <radialGradient id={id("feutre")} cx="0.4" cy="0.3" r="0.8">
        <stop offset="0" stopColor="#3a3a3f" />
        <stop offset="0.6" stopColor="#1b1b1f" />
        <stop offset="1" stopColor="#0b0b0d" />
      </radialGradient>
      <linearGradient id={id("toile")} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#4d72a0" />
        <stop offset="1" stopColor="#223b5c" />
      </linearGradient>
      <linearGradient id={id("verre")} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#3d5560" />
        <stop offset="0.55" stopColor="#0c1418" />
        <stop offset="1" stopColor="#1e2c33" />
      </linearGradient>
      <radialGradient id={id("velours")} cx="0.5" cy="0.35" r="0.7">
        <stop offset="0" stopColor="#3a3a3a" />
        <stop offset="1" stopColor="#0a0a0a" />
      </radialGradient>
    </defs>
  );
}

// Rayures d'une marinière : elles font le tour du corps, donc apparaissent verticales et légèrement bombées.
function Stripes({ from, to }: { from: number; to: number }) {
  const lines = [];
  for (let x = from; x <= to; x += 14) {
    lines.push(<path key={x} d={`M${x} 90 Q${x + 5} 140 ${x} 194`} stroke="#1f3a5f" strokeWidth="6" fill="none" />);
  }
  return <>{lines}</>;
}

// Un vêtement seul, dans le même repère que le chien.
export function Garment({ id, uid, fit = "gabarit" }: { id: GarmentId; uid: string; fit?: Fit }) {
  const u = (name: string) => `url(#${uid}-${name})`;
  const photo = fit === "photo";
  const clip = photo ? u("ample") : u("torse");
  switch (id) {
    case "mariniere":
      return (
        <g filter={u("pose")} clipPath={u("ourlet")}>
          <g clipPath={clip}>
            <rect x="130" y="60" width="240" height="140" fill="#f6f3ec" />
            <Stripes from={142} to={350} />
            <rect x="130" y="60" width="240" height="140" fill={u("volume")} />
          </g>
          {/* Bord-côte à l'arrière et col */}
          <g clipPath={clip}>
            <path d="M150 88 C134 116 132 160 146 198" stroke={u("cotes-blanc")} strokeWidth="16" fill="none" />
          </g>
          {photo ? (
            <path d={FRONT} stroke={u("cotes-blanc")} strokeWidth="12" fill="none" />
          ) : (
            <>
              <path d="M308 72 L344 112" stroke={u("cotes-blanc")} strokeWidth="11" strokeLinecap="round" />
              <path d="M308 72 L344 112" stroke="#1f3a5f" strokeWidth="2" strokeLinecap="round" transform="translate(-4 3)" />
            </>
          )}
        </g>
      );
    case "manteau":
      return (
        <g filter={u("pose")}>
          <g clipPath={clip}>
            <g clipPath={u("ourlet-long")}>
            <rect x="106" y="60" width="200" height="140" fill={u("matelasse")} />
            {/* Coutures horizontales du matelassage */}
            <path d="M106 128 H306 M106 152 H306" stroke="#0f1724" strokeWidth="1.4" strokeDasharray="3 2" opacity="0.7" />
            <rect x="106" y="60" width="200" height="140" fill={u("volume")} />
            {/* Bande réfléchissante sur le dos */}
            <rect x="106" y="108" width="200" height="3" fill="#dfe3e8" opacity="0.85" />
            {/* Bordure sous le ventre */}
            <rect x="106" y="172" width="200" height="16" fill="#101826" />
            <path d="M118 88 C102 116 100 160 114 198" stroke="#101826" strokeWidth="8" fill="none" />
            </g>
          </g>
          {/* Sangle ventrale auto-agrippante */}
          <rect x="248" y="150" width="16" height="40" rx="3" fill="#101826" />
          <path d="M251 156 h10 M251 162 h10 M251 168 h10" stroke="#2c3b55" strokeWidth="1.5" />
          {/* Étiquette du bar */}
          <rect x="116" y="132" width="16" height="10" rx="1.5" fill="#b3122a" />
          {/* Col en fausse fourrure */}
          {photo ? <path d={FRONT} stroke="#efe6d4" strokeWidth="14" fill="none" clipPath={clip} /> : null}
          {photo ? null : (
          <path
            d="M282 94 C288 86 296 80 304 76 C306 70 312 70 314 74 C318 70 324 72 324 78 C328 78 330 84 326 88 C318 96 308 104 296 112 C292 114 286 110 288 106 C282 106 280 100 282 94 Z"
            fill="#efe6d4"
          />
          )}
          {photo ? null : <path d="M290 100 C298 94 308 86 318 80" stroke="#d8ccb3" strokeWidth="2" fill="none" />}
        </g>
      );
    case "pull-torsade":
      return (
        <g filter={u("pose")}>
          <g clipPath={clip}>
            <g clipPath={u("ourlet")}>
            <rect x="130" y="60" width="240" height="140" fill={u("torsades")} />
            <rect x="130" y="60" width="240" height="140" fill={u("volume")} />
            <path d="M150 88 C134 116 132 160 146 198" stroke={u("cotes")} strokeWidth="18" fill="none" />
            </g>
            <rect x="140" y="172" width="230" height="14" fill={u("cotes")} />
          </g>
          {/* Col roulé côtelé, épais */}
          {photo ? (
            <path d={FRONT} stroke={u("cotes")} strokeWidth="14" fill="none" />
          ) : (
            <>
              <path d="M302 76 L330 62 L352 96 L326 114 Z" fill={u("cotes")} />
              <path d="M302 76 L330 62 L352 96 L326 114 Z" fill={u("pli")} />
              <path d="M304 80 C316 86 326 98 330 112" stroke="#b9a681" strokeWidth="2" fill="none" />
            </>
          )}
        </g>
      );
    case "harnais":
      return (
        <g filter={u("pose")}>
          <g clipPath={clip}>
            {/* Rembourrage clair sous les sangles */}
            <rect x="193" y="98" width="17" height="90" rx="5" fill="#d9c7a4" />
            <rect x="196" y="98" width="11" height="90" rx="4" fill={u("cuir")} />
            <path d="M198.5 100 V186 M204.5 100 V186" stroke="#e2c79a" strokeWidth="0.9" strokeDasharray="2.5 2" />
            <g transform="rotate(-18 290 140)">
              <rect x="281" y="98" width="17" height="90" rx="5" fill="#d9c7a4" />
              <rect x="284" y="98" width="11" height="90" rx="4" fill={u("cuir")} />
              <path d="M286.5 100 V186 M292.5 100 V186" stroke="#e2c79a" strokeWidth="0.9" strokeDasharray="2.5 2" />
            </g>
            <rect x="196" y="101" width="96" height="11" rx="4" fill={u("cuir-h")} />
            <path d="M198 103.5 H290 M198 109.5 H290" stroke="#e2c79a" strokeWidth="0.9" strokeDasharray="2.5 2" />
          </g>
          {/* Anneau en D et boucle en métal */}
          <path d="M240 106 V98 A8 8 0 0 1 256 98 V106 Z" fill="none" stroke={u("metal")} strokeWidth="3.5" />
          <rect x="193" y="148" width="17" height="13" rx="2.5" fill="none" stroke={u("metal")} strokeWidth="3" />
          <rect x="200" y="150" width="3" height="9" fill={u("metal")} />
        </g>
      );
    case "foulard":
      return (
        <g filter={u("pose")}>
          {/* Liseré clair : le foulard rouge reste lisible sur le rideau rouge. */}
          <path d="M302 124 C318 128 334 122 348 108 L326 172 Z" fill={u("pois")} stroke="#fbf7ef" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M302 124 C318 128 334 122 348 108 L326 172 Z" fill={u("pli")} />
          <path d="M314 128 L324 160 M334 122 L327 156" stroke="#7d0a1d" strokeWidth="1.4" opacity="0.5" fill="none" />
          <path d="M300 122 C318 128 336 120 350 106" stroke="#fbf7ef" strokeWidth="10" fill="none" strokeLinecap="round" />
          <path d="M300 122 C318 128 336 120 350 106" stroke={u("pois")} strokeWidth="7" fill="none" strokeLinecap="round" />
          {/* Nœud */}
          <ellipse cx="324" cy="126" rx="7" ry="6" fill="#c8102e" stroke="#fbf7ef" strokeWidth="1.5" />
          <ellipse cx="322" cy="124" rx="3" ry="2" fill="#fff" opacity="0.3" />
        </g>
      );
    case "noeud":
      return (
        <g filter={u("pose")}>
          <path d="M322 142 C314 134 306 130 304 134 C302 140 303 150 306 154 C310 154 316 148 322 142 Z" fill={u("velours")} />
          <path d="M322 142 C330 134 338 130 340 134 C342 140 341 150 338 154 C334 154 328 148 322 142 Z" fill={u("velours")} />
          <path d="M308 138 C312 141 316 142 319 142 M308 150 C312 146 316 144 319 143" stroke="#4a4a4a" strokeWidth="1" fill="none" />
          <path d="M336 138 C332 141 328 142 325 142 M336 150 C332 146 328 144 325 143" stroke="#4a4a4a" strokeWidth="1" fill="none" />
          <rect x="317" y="136.5" width="10" height="11" rx="3" fill="#1d1d1d" stroke="#3c3c3c" strokeWidth="1" />
        </g>
      );
    case "lunettes":
      return (
        <g filter={u("pose")}>
          <path d="M344 78 L318 75" stroke="#1a1a1a" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="356" cy="81" r="13" fill={u("verre")} stroke="#151515" strokeWidth="3" />
          <path d="M347 76 C350 71 357 70 362 72" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.75" />
          <path d="M350 88 L364 74" stroke="#9fd3e6" strokeWidth="1.4" opacity="0.35" />
          <path d="M369 80 L378 84" stroke="#151515" strokeWidth="3" strokeLinecap="round" />
        </g>
      );
    case "beret":
      return (
        <g filter={u("pose")}>
          <ellipse cx="326" cy="54" rx="38" ry="13" transform="rotate(-12 326 54)" fill={u("feutre")} />
          {/* Bord retourné, plus clair */}
          <path d="M290 62 C306 66 336 60 360 46" stroke="#2c2c31" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M320 44 C321 38 325 33 330 31" stroke="#1b1b1f" strokeWidth="4" strokeLinecap="round" fill="none" />
        </g>
      );
    case "casquette":
      return (
        <g filter={u("pose")}>
          <path d="M296 64 C296 36 350 30 362 58 Z" fill={u("toile")} />
          {/* Coutures des panneaux */}
          <path d="M330 36 C326 44 322 54 320 62 M330 36 C340 42 348 50 352 58" stroke="#1b3150" strokeWidth="1.3" fill="none" />
          <path d="M300 60 C318 56 340 56 360 58" stroke="#1b3150" strokeWidth="1" strokeDasharray="2 2" fill="none" />
          {/* Visière */}
          <path d="M354 54 C374 50 394 54 402 62 C390 67 370 65 352 62 Z" fill="#1b3150" />
          <path d="M358 57 C374 55 388 57 396 61" stroke="#4d72a0" strokeWidth="1" strokeDasharray="2 2" fill="none" />
          <circle cx="330" cy="36" r="3.6" fill="#1b3150" />
          {/* Oeillets d'aération */}
          <circle cx="316" cy="46" r="1.4" fill="#152741" />
          <circle cx="344" cy="44" r="1.4" fill="#152741" />
        </g>
      );
  }
}

// Manches et poignets : posés après les pattes avant, pour envelopper le haut de la patte.
function Sleeve({ id, uid }: { id: GarmentId; uid: string }) {
  const u = (name: string) => `url(#${uid}-${name})`;
  if (id === "mariniere") {
    return (
      <g filter={u("pose")}>
        <path d="M281 158 H309 V192 C300 195 290 195 281 192 Z" fill="#f6f3ec" />
        <path d="M289 158 v36 M301 158 v36" stroke="#1f3a5f" strokeWidth="5" />
        <path d="M281 186 H309 V194 C300 197 290 197 281 194 Z" fill={u("cotes-blanc")} />
      </g>
    );
  }
  if (id === "pull-torsade") {
    return (
      <g filter={u("pose")}>
        <path d="M280 158 H310 V192 C300 196 290 196 280 192 Z" fill="#e9ddc5" />
        <path d="M295 168 C301 174 301 182 295 188 M295 168 C289 174 289 182 295 188" stroke="#b7a37c" strokeWidth="3" fill="none" />
        <path d="M280 186 H310 V195 C300 199 290 199 280 195 Z" fill={u("cotes")} />
      </g>
    );
  }
  return null;
}

// Fond de cabine : rideau rouge éclairé au centre et sol de studio, pour la scène et l'export.
export function Backdrop({ uid }: { uid: string }) {
  return (
    <g>
      <defs>
        <radialGradient id={`${uid}-studio`} cx="0.55" cy="0.42" r="0.75">
          <stop offset="0" stopColor="#cb1a34" />
          <stop offset="0.65" stopColor="#b3122a" />
          <stop offset="1" stopColor="#7d0b1d" />
        </radialGradient>
      </defs>
      <rect width="420" height="260" fill={`url(#${uid}-studio)`} />
      {/* Plis du rideau */}
      {[30, 90, 150, 210, 270, 330, 390].map((x) => (
        <rect key={x} x={x} y="0" width="22" height="214" fill="#000" opacity="0.06" />
      ))}
      <rect y="214" width="420" height="46" fill="#7d0b1d" />
      <rect y="214" width="420" height="2" fill="#000" opacity="0.2" />
    </g>
  );
}

// Ombres et reflets de la vraie photo, recalés dans le repère de la pièce.
export type Shade = { href: string; x: number; y: number; width: number; height: number; transform?: string; gain: number };

// Une pièce seule, en SVG autonome : vignette du dressing, calque de la cabine ou image d'export.
export function GarmentSvg({
  id,
  box,
  uid,
  fit = "gabarit",
  stretch = false,
  sleeves = false,
  className,
  svgRef,
  shade,
}: {
  shade?: Shade;
  id: GarmentId;
  box: [number, number, number, number];
  uid: string;
  fit?: Fit;
  stretch?: boolean;
  sleeves?: boolean;
  className?: string;
  svgRef?: (el: SVGSVGElement | null) => void;
}) {
  return (
    <svg
      ref={svgRef}
      viewBox={box.join(" ")}
      preserveAspectRatio={stretch ? "none" : "xMidYMid meet"}
      className={className}
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
    >
      <SharedDefs uid={uid} />
      <Garment id={id} uid={uid} fit={fit} />
      {sleeves ? <Sleeve id={id} uid={uid} /> : null}
      {shade ? (
        <>
          <defs>
            {/* La photo en niveaux de gris, éclaircie pour les pelages sombres. */}
            <filter id={`${uid}-gris`} colorInterpolationFilters="sRGB">
              <feColorMatrix type="saturate" values="0" />
              <feComponentTransfer>
                <feFuncR type="linear" slope={shade.gain} />
                <feFuncG type="linear" slope={shade.gain} />
                <feFuncB type="linear" slope={shade.gain} />
              </feComponentTransfer>
            </filter>
          </defs>
          {/* Découpe portée par l'image elle-même : un groupe isolerait le mélange et couvrirait le tissu. */}
          <defs>
            <clipPath id={`${uid}-ombre`} clipPath={`url(#${uid}-ample)`}>
              <path d={id === "manteau" ? "M118 88 C102 116 100 160 114 198 H420 V60 H118 Z" : "M150 88 C134 116 132 160 146 198 H420 V60 H150 Z"} />
            </clipPath>
          </defs>
              <image
                clipPath={`url(#${uid}-ombre)`}
                href={shade.href}
                x={shade.x}
                y={shade.y}
                width={shade.width}
                height={shade.height}
                preserveAspectRatio="none"
                transform={shade.transform}
                filter={`url(#${uid}-gris)`}
                opacity="0.75"
                style={{ mixBlendMode: "soft-light" }}
              />
        </>
      ) : null}
    </svg>
  );
}
