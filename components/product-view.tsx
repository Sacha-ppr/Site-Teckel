"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { useCart } from "@/components/cart-provider";
import { formatPrice, type Product } from "@/lib/catalog";
import { SIZES, recommendSize, type ProductDetails, type SizeId } from "@/lib/product-details";
import type { ProductImage } from "@/lib/product-images";

type Props = { product: Product; details: ProductDetails | null; images: ProductImage[] };

export function ProductView({ product, details, images }: Props) {
  const { add } = useCart();
  const [size, setSize] = useState<SizeId | null>(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState<{ size: SizeId | null; qty: number } | null>(null);
  const [ctaVisible, setCtaVisible] = useState(true);
  const ctaRef = useRef<HTMLDivElement>(null);
  const soldOut = product.stock <= 0;
  const needsSize = Boolean(details?.sizes);

  // Barre d'achat collante sur mobile, dès que le bouton principal sort de l'écran.
  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setCtaVisible(entry.isIntersecting), { rootMargin: "-80px 0px 0px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const addToCart = () => {
    if (soldOut || (needsSize && !size)) return;
    add(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        priceCents: product.price_cents,
        color: product.color,
        variant: size ?? undefined,
      },
      qty,
    );
    setAdded({ size, qty });
  };

  const ctaLabel = soldOut
    ? "Épuisé pour le moment"
    : needsSize && !size
      ? "Choisissez une taille"
      : `Ajouter au panier · ${formatPrice(product.price_cents * qty)}`;

  return (
    <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-16">
      <Gallery images={images} name={product.name} />

      <div>
        <h1 className="enseigne text-[clamp(2.4rem,5vw,4.2rem)]">{product.name}</h1>
        <p className="mt-5 max-w-[34rem] text-[1.25rem] leading-snug font-bold">{details?.promise ?? product.description}</p>

        <div className="mt-7 flex flex-wrap items-baseline gap-x-6 gap-y-2 border-y-2 border-encre py-5">
          <span className="text-[3.2rem] leading-none font-extrabold tabular-nums [font-stretch:78%]">{formatPrice(product.price_cents)}</span>
          <StockLine stock={product.stock} />
        </div>

        {needsSize && details?.sizes ? (
          <SizePicker rule={details.sizes} size={size} onChange={setSize} />
        ) : (
          <p className="mt-6 legende text-encre-douce">Taille unique</p>
        )}

        <div ref={ctaRef} className="mt-7 flex flex-wrap items-stretch gap-3">
          <Stepper value={qty} max={Math.max(1, Math.min(product.stock, 9))} onChange={setQty} disabled={soldOut} />
          <button type="button" onClick={addToCart} disabled={soldOut || (needsSize && !size)} className="btn btn-jeton flex-1 py-4 text-[1rem]">
            {ctaLabel}
          </button>
        </div>

        {added ? (
          <div role="status" className="panneau mt-4 flex flex-wrap items-center justify-between gap-3 p-4">
            <p className="font-bold">
              {added.qty} × {product.name}
              {added.size ? ` · taille ${added.size}` : ""} ajouté au panier
            </p>
            <Link href="/panier" className="btn btn-jeton px-5 py-2.5 text-[0.8rem]">
              Voir le panier
            </Link>
          </div>
        ) : null}

        <ul className="mt-6 flex flex-col gap-1.5 text-encre-douce">
          <li>Livraison offerte dès 60 €, sinon 5,90 €. Retrait gratuit au bar.</li>
          <li>Testé par nos résidents avant d&apos;entrer en boutique.</li>
        </ul>
      </div>

      {/* Barre d'achat mobile */}
      <div
        className={`fixed inset-x-0 bottom-0 z-30 border-t-2 border-encre bg-tirage p-3 transition-transform duration-300 lg:hidden ${
          ctaVisible ? "translate-y-full" : "translate-y-0"
        }`}
        aria-hidden={ctaVisible}
      >
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate font-bold">{product.name}</p>
            <p className="text-sm text-encre-douce tabular-nums">
              {formatPrice(product.price_cents)}
              {size ? ` · taille ${size}` : ""}
            </p>
          </div>
          {needsSize && !size ? (
            <button type="button" tabIndex={ctaVisible ? -1 : 0} onClick={() => ctaRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })} className="btn btn-jeton px-5 py-3 text-[0.8rem]">
              Choisir la taille
            </button>
          ) : (
            <button type="button" tabIndex={ctaVisible ? -1 : 0} onClick={addToCart} disabled={soldOut} className="btn btn-jeton px-5 py-3 text-[0.8rem]">
              Ajouter
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function StockLine({ stock }: { stock: number }) {
  if (stock <= 0) return <span className="legende text-rouge">Épuisé pour le moment</span>;
  if (stock <= 5)
    return (
      <span className="legende flex items-center gap-2 text-rouge">
        <span className="size-2 rounded-full bg-rouge" aria-hidden />
        Plus que {stock} en stock
      </span>
    );
  return (
    <span className="legende flex items-center gap-2 text-encre-douce">
      <span className="size-2 rounded-full bg-[#2f8a4a]" aria-hidden />
      En stock · expédié sous 48 h
    </span>
  );
}

function Stepper({ value, max, onChange, disabled }: { value: number; max: number; onChange: (v: number) => void; disabled?: boolean }) {
  return (
    <div className="flex items-center rounded-full border-2 border-encre" role="group" aria-label="Quantité">
      <button type="button" disabled={disabled || value <= 1} onClick={() => onChange(value - 1)} className="grid size-12 place-items-center rounded-full hover:bg-jeton disabled:opacity-30" aria-label="Retirer un">
        <svg viewBox="0 0 16 16" className="size-3.5" aria-hidden fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 8h10" strokeLinecap="round" /></svg>
      </button>
      <span className="w-6 text-center text-lg font-extrabold tabular-nums" aria-live="polite">{value}</span>
      <button type="button" disabled={disabled || value >= max} onClick={() => onChange(value + 1)} className="grid size-12 place-items-center rounded-full hover:bg-jeton disabled:opacity-30" aria-label="Ajouter un">
        <svg viewBox="0 0 16 16" className="size-3.5" aria-hidden fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M8 3v10M3 8h10" strokeLinecap="round" /></svg>
      </button>
    </div>
  );
}

// ——— Galerie : la photo en tirage, zoom à la loupe au survol ou au toucher ———

function Gallery({ images, name }: { images: ProductImage[]; name: string }) {
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const [flash, setFlash] = useState(0);
  const img = images[index];

  const move = (e: ReactPointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };

  if (!img) return <div className="tirage aspect-square" />;

  return (
    <div className="lg:sticky lg:top-24">
      <div className={`grid gap-3 ${images.length > 1 ? "grid-cols-[4.5rem_1fr] sm:grid-cols-[5.5rem_1fr]" : ""}`}>
        {images.length > 1 ? (
          <ul className="tirage flex flex-col gap-2 self-start p-1.5" aria-label="Vues de l'article">
            {images.map((im, i) => (
              <li key={im.src}>
                <button
                  type="button"
                  onClick={() => {
                    setIndex(i);
                    setFlash((f) => f + 1);
                  }}
                  aria-label={`Vue ${i + 1} : ${im.alt}`}
                  aria-current={i === index}
                  className={`relative block aspect-square w-full overflow-hidden ${i === index ? "outline-3 outline-offset-1 outline-jeton" : "opacity-70 hover:opacity-100"}`}
                >
                  <Image src={im.src} alt="" fill sizes="90px" className="object-cover" />
                </button>
              </li>
            ))}
          </ul>
        ) : null}

        <figure className="tirage">
          <div
            className="relative aspect-square cursor-zoom-in overflow-hidden bg-tirage-2 touch-pan-y"
            onPointerMove={(e) => e.pointerType === "mouse" && move(e)}
            onPointerLeave={(e) => e.pointerType === "mouse" && setZoom(null)}
            onClick={(e) => {
              // Au toucher : un tap zoome à l'endroit touché, un second tap dézoome.
              if (zoom) setZoom(null);
              else {
                const r = e.currentTarget.getBoundingClientRect();
                setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
              }
            }}
          >
            <Image
              src={img.src}
              alt={img.alt || name}
              fill
              priority
              sizes="(min-width: 1024px) 45vw, 92vw"
              className="object-cover transition-transform duration-200 ease-out"
              style={zoom ? { transform: "scale(2.2)", transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
            />
            <span key={flash} className={`pose-flash ${flash ? "pose-flash-clic" : ""}`} aria-hidden />
            <span className="pointer-events-none absolute right-3 bottom-3 grid size-10 place-items-center rounded-full bg-encre/80 text-tirage" aria-hidden>
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="6.5" />
                <path d="M16 16l4.5 4.5" strokeLinecap="round" />
                {zoom ? <path d="M8 11h6" strokeLinecap="round" /> : <path d="M8 11h6M11 8v6" strokeLinecap="round" />}
              </svg>
            </span>
          </div>
          <figcaption className="legende flex justify-between px-1 pt-3 text-encre-douce">
            <span>{zoom ? "Déplacez pour explorer" : "Survolez ou touchez pour zoomer"}</span>
            {images.length > 1 ? (
              <span className="tabular-nums">
                {index + 1} / {images.length}
              </span>
            ) : null}
          </figcaption>
        </figure>
      </div>
    </div>
  );
}

// ——— Guide des tailles : on mesure son teckel, la fiche conseille ———

function SizePicker({ rule, size, onChange }: { rule: "dos" | "poitrail"; size: SizeId | null; onChange: (s: SizeId) => void }) {
  const [open, setOpen] = useState(false);
  const [dos, setDos] = useState(38);
  const [poitrail, setPoitrail] = useState(46);
  const advice = recommendSize(dos, poitrail, rule);

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between gap-3">
        <p className="legende">Taille {size ? `· ${size}` : ""}</p>
        <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="legende text-rouge underline hover:no-underline">
          {open ? "Fermer le guide" : "Trouver sa taille"}
        </button>
      </div>
      <div className="mt-3 grid grid-cols-4 gap-2" role="radiogroup" aria-label="Taille">
        {SIZES.map((s) => {
          const on = size === s.id;
          return (
            <button
              key={s.id}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => onChange(s.id)}
              className={`flex flex-col items-center rounded-xl border-2 px-1 py-2.5 transition-colors ${
                on ? "border-encre bg-encre text-jeton" : "border-encre/25 hover:border-encre"
              }`}
            >
              <span className="text-[1.3rem] leading-none font-extrabold [font-stretch:80%]">{s.id}</span>
              <span className={`mt-1 text-[0.72rem] leading-tight ${on ? "text-tirage" : "text-encre-douce"}`}>{s.hint}</span>
            </button>
          );
        })}
      </div>

      {open ? (
        <div className="panneau mt-4 p-4 sm:p-5">
          <p className="enseigne text-[1.2rem]">Mesurez votre teckel</p>
          {/* Le gabarit de mesure : une vraie photo de teckel avec les deux mesures tracées dessus. */}
          <div className="relative mt-3 aspect-[3/2] overflow-hidden rounded-lg bg-case">
            {/* eslint-disable-next-line @next/next/no-img-element -- photo détourée, superposée aux repères */}
            <img src="/guide/teckel-profil.webp" alt="Teckel de profil avec les repères de mesure" className="absolute inset-0 h-full w-full" />
            <svg viewBox="0 0 150 100" className="absolute inset-0 h-full w-full" aria-hidden>
              <g stroke="#ffd400" strokeWidth="0.9" fill="none" strokeLinecap="round">
                <path d="M68 44 C52 49 34 50 21 52" strokeDasharray="2 1.5" />
                <path d="M68 41 v6 M21 49 v6" />
                <ellipse cx="68" cy="62" rx="5" ry="15" strokeDasharray="2 1.5" />
              </g>
              <g fill="#ffd400" fontSize="4.2" fontWeight="800" fontFamily="system-ui">
                <text x="34" y="46">DOS</text>
                <text x="74" y="64">POITRAIL</text>
              </g>
            </svg>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Measure label="Longueur du dos" hint="Base du cou → naissance de la queue" value={dos} min={22} max={52} onChange={setDos} />
            <Measure label="Tour de poitrail" hint="Juste derrière les pattes avant" value={poitrail} min={28} max={62} onChange={setPoitrail} />
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#444] pt-4">
            <p>
              <span className="legende text-chrome-clair">Taille conseillée</span>
              <span className="compteur ml-3 align-middle text-[2.6rem]">{advice.size}</span>
            </p>
            <button type="button" onClick={() => { onChange(advice.size); setOpen(false); }} className="btn btn-jeton px-5 py-2.5 text-[0.8rem]">
              Choisir la taille {advice.size}
            </button>
          </div>
          <p className="mt-3 text-sm text-chrome-clair">
            {advice.between
              ? `Votre teckel est entre deux tailles : pour ${rule === "dos" ? "un vêtement, la longueur du dos" : "un harnais, le tour de poitrail"} décide. En cas de doute, venez l'essayer au bar.`
              : `Pour ${rule === "dos" ? "un vêtement, c'est la longueur du dos" : "un harnais, c'est le tour de poitrail"} qui compte.`}
          </p>
        </div>
      ) : null}
    </div>
  );
}

function Measure({ label, hint, value, min, max, onChange }: { label: string; hint: string; value: number; min: number; max: number; onChange: (v: number) => void }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="flex items-baseline justify-between gap-2">
        <span className="legende text-chrome-clair">{label}</span>
        <span className="compteur text-[1.6rem]">{value} cm</span>
      </span>
      <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))} className="accent-jeton" />
      <span className="text-[0.8rem] text-chrome-clair">{hint}</span>
    </label>
  );
}
