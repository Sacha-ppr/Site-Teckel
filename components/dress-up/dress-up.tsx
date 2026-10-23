"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useRef, useState } from "react";
import type { DragEvent } from "react";
import { useCart } from "@/components/cart-provider";
import { formatPrice, type Product } from "@/lib/catalog";
import {
  CATEGORIES,
  COATS,
  GARMENTS,
  garment,
  lookGarments,
  type Category,
  type Coat,
  type GarmentId,
  type Look,
} from "@/lib/dress-up";
import { GarmentIcon, TeckelFigure, VIEWBOX } from "./teckel-art";

const DRAG_TYPE = "application/x-teckel-garment";

export function DressUp({ products }: { products: Product[] }) {
  const uid = useId().replace(/:/g, "");
  const router = useRouter();
  const { add } = useCart();
  const [coat, setCoat] = useState<Coat>("fauve");
  const [look, setLook] = useState<Look>({});
  const [tab, setTab] = useState<Category>("tete");
  const [dropping, setDropping] = useState(false);
  const [flashKey, setFlashKey] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);

  const bySlug = new Map(products.map((p) => [p.slug, p]));
  const worn = lookGarments(look);
  const wornProducts = worn.map((g) => ({ garment: g, product: bySlug.get(g.productSlug) }));
  const buyable = wornProducts.filter((w) => w.product && w.product.stock > 0);
  const total = buyable.reduce((n, w) => n + w.product!.price_cents, 0);

  // Enfiler un vêtement remplace celui du même emplacement ; recliquer dessus le retire.
  const toggle = (id: GarmentId) => {
    const { slot } = garment(id);
    setLook((current) => {
      const next = { ...current };
      if (next[slot] === id) delete next[slot];
      else next[slot] = id;
      return next;
    });
  };

  const wear = (id: GarmentId) => {
    const { slot } = garment(id);
    setLook((current) => ({ ...current, [slot]: id }));
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDropping(false);
    const id = e.dataTransfer.getData(DRAG_TYPE) as GarmentId;
    if (GARMENTS.some((g) => g.id === id)) wear(id);
  };

  const buyLook = () => {
    for (const { product } of buyable) {
      add({
        productId: product!.id,
        slug: product!.slug,
        name: product!.name,
        priceCents: product!.price_cents,
        color: product!.color,
      });
    }
    router.push("/panier");
  };

  const download = async () => {
    if (!svgRef.current) return;
    setFlashKey((k) => k + 1);
    await exportLook(svgRef.current, worn.map((g) => {
      const p = bySlug.get(g.productSlug);
      return p ? `${p.name} · ${formatPrice(p.price_cents)}` : g.label;
    }));
  };

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:grid-rows-[auto_1fr] lg:gap-x-12">
      {/* La cabine : le chien pose, on y dépose les vêtements. Elle reste visible pendant qu'on choisit. */}
      <div className="sticky top-[100px] z-10 lg:top-24 lg:col-start-1 lg:row-start-1">
        <div className="tirage">
          <div
            onDragOver={(e) => {
              if (e.dataTransfer.types.includes(DRAG_TYPE)) {
                e.preventDefault();
                setDropping(true);
              }
            }}
            onDragLeave={() => setDropping(false)}
            onDrop={onDrop}
            className={`relative overflow-hidden bg-rouge transition-[outline-color] ${
              dropping ? "outline-4 -outline-offset-4 outline-jeton" : "outline-0"
            }`}
          >
            <svg
              ref={svgRef}
              viewBox={VIEWBOX}
              className="block aspect-[420/260] w-full"
              role="img"
              aria-label={`Teckel ${COATS.find((c) => c.id === coat)!.label.toLowerCase()}${
                worn.length ? `, habillé avec : ${worn.map((g) => g.label.toLowerCase()).join(", ")}` : ", sans vêtement"
              }`}
            >
              <TeckelFigure coat={coat} look={look} uid={`${uid}-scene`} />
            </svg>
            <span key={flashKey} className={`pose-flash ${flashKey ? "pose-flash-clic" : ""}`} aria-hidden />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 px-1 pt-3">
            <p className="legende text-encre-douce">
              {dropping ? "Lâchez pour enfiler" : "Cliquez ou glissez une pièce"}
            </p>
            <p className="legende text-encre-douce tabular-nums">{worn.length} / 5 pièces</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6 lg:col-start-2 lg:row-span-2 lg:row-start-1">
        <div className="panneau p-4 sm:p-6">
          <h2 className="enseigne text-[1.5rem]">Le modèle</h2>
          <div className="mt-4 grid grid-cols-3 gap-2" role="radiogroup" aria-label="Robe du teckel">
            {COATS.map((c) => {
              const selected = coat === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setCoat(c.id)}
                  className={`rounded-xl p-2 text-left transition-colors ${
                    selected ? "bg-jeton text-encre" : "bg-case text-chrome-clair hover:bg-[#363636]"
                  }`}
                >
                  <svg viewBox="20 20 400 230" className="w-full" aria-hidden>
                    <TeckelFigure coat={c.id} look={{}} uid={`${uid}-${c.id}`} />
                  </svg>
                  <span className="mt-1 block text-[0.85rem] leading-tight font-bold">{c.label}</span>
                </button>
              );
            })}
          </div>

          <h2 className="enseigne mt-8 text-[1.5rem]">Le dressing</h2>
          <div className="mt-4 flex flex-wrap gap-2" role="tablist" aria-label="Rayons du dressing">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                type="button"
                role="tab"
                id={`${uid}-tab-${c.id}`}
                aria-selected={tab === c.id}
                aria-controls={`${uid}-panel`}
                onClick={() => setTab(c.id)}
                className={`btn px-4 py-2 text-[0.8rem] ${
                  tab === c.id ? "bg-jeton text-encre" : "border-2 border-chrome text-chrome-clair hover:bg-case"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
          <ul
            id={`${uid}-panel`}
            role="tabpanel"
            aria-labelledby={`${uid}-tab-${tab}`}
            className="mt-4 grid grid-cols-3 gap-2"
          >
            {GARMENTS.filter((g) => g.category === tab).map((g) => {
              const on = look[g.slot] === g.id;
              return (
                <li key={g.id}>
                  <button
                    type="button"
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData(DRAG_TYPE, g.id);
                      e.dataTransfer.effectAllowed = "copy";
                    }}
                    onClick={() => toggle(g.id)}
                    aria-pressed={on}
                    className={`flex h-full w-full cursor-grab flex-col items-center gap-2 rounded-xl p-3 active:cursor-grabbing ${
                      on ? "bg-jeton text-encre" : "bg-case text-chrome-clair hover:bg-[#363636]"
                    }`}
                  >
                    <span className="block h-14 w-full">
                      <GarmentIcon id={g.id} box={g.iconBox} uid={`${uid}-${g.id}`} />
                    </span>
                    <span className="text-center text-[0.8rem] leading-tight font-bold">{g.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* La passerelle boutique : ce que porte le teckel, avec les vrais prix. */}
        <section aria-labelledby={`${uid}-look`}>
          <h2 id={`${uid}-look`} className="enseigne text-[1.8rem]">
            Le look
          </h2>
          {worn.length === 0 ? (
            <p className="mt-4 border-y-2 border-encre py-5 text-encre-douce">
              Votre teckel ne porte rien pour l&apos;instant. Choisissez une pièce dans le dressing.
            </p>
          ) : (
            <ul className="mt-4 border-t-2 border-encre" aria-live="polite">
              {wornProducts.map(({ garment: g, product }) => (
                <li key={g.id} className="flex items-center gap-4 border-b-2 border-encre py-3">
                  <div className="min-w-0 flex-1">
                    {product ? (
                      <Link href={`/boutique/${product.slug}`} className="font-bold hover:text-rouge">
                        {product.name}
                      </Link>
                    ) : (
                      <span className="font-bold">{g.label}</span>
                    )}
                    <p className="text-sm text-encre-douce">
                      {!product ? "Bientôt en boutique" : product.stock > 0 ? "En stock" : "Épuisé pour le moment"}
                    </p>
                  </div>
                  <span className="text-lg font-extrabold tabular-nums [font-stretch:80%]">
                    {product ? formatPrice(product.price_cents) : "–"}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggle(g.id)}
                    className="grid size-9 shrink-0 place-items-center rounded-full border-2 border-encre hover:bg-jeton"
                    aria-label={`Retirer : ${g.label}`}
                  >
                    <svg viewBox="0 0 16 16" className="size-3.5" aria-hidden fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M4 4l8 8M12 4l-8 8" strokeLinecap="round" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
            <p className="flex items-baseline gap-3">
              <span className="text-[2.4rem] leading-none font-extrabold tabular-nums [font-stretch:80%]">
                {formatPrice(total)}
              </span>
              <span className="text-sm text-encre-douce">
                {buyable.length} article{buyable.length > 1 ? "s" : ""} disponible{buyable.length > 1 ? "s" : ""}
              </span>
            </p>
            {buyable.length > 0 ? (
              <button type="button" onClick={buyLook} className="btn btn-encre">
                Acheter ce look
              </button>
            ) : (
              <Link href="/boutique" className="btn btn-ligne">
                Voir les articles en boutique
              </Link>
            )}
          </div>
        </section>
      </div>

      <div className="flex flex-wrap gap-3 lg:col-start-1 lg:row-start-2">
        <button type="button" onClick={download} className="btn btn-jeton">
          Télécharger mon look
        </button>
        <button
          type="button"
          onClick={() => {
            setLook({});
            setCoat("fauve");
          }}
          disabled={worn.length === 0 && coat === "fauve"}
          className="btn btn-ligne"
        >
          Réinitialiser
        </button>
      </div>
    </div>
  );
}

// Compose un tirage photo (PNG) : le teckel habillé sur le rideau rouge, puis la légende du look.
async function exportLook(svg: SVGSVGElement, lines: string[]) {
  const W = 1200;
  const PAD = 48;
  const sceneH = Math.round(((W - PAD * 2) * 260) / 420);
  const H = PAD + sceneH + 150 + Math.max(lines.length, 1) * 44 + 80;

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.fillStyle = "#fffefa";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#b3122a";
  ctx.fillRect(PAD, PAD, W - PAD * 2, sceneH);

  const clone = svg.cloneNode(true) as SVGSVGElement;
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  clone.setAttribute("width", String(W - PAD * 2));
  clone.setAttribute("height", String(sceneH));
  const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(clone)], { type: "image/svg+xml" }));
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    ctx.drawImage(img, PAD, PAD, W - PAD * 2, sceneH);
  } finally {
    URL.revokeObjectURL(url);
  }

  // La police du site est déjà chargée : le canvas peut l'utiliser.
  const family = getComputedStyle(document.body).fontFamily;
  const setFont = (weight: number, size: number, stretch: CanvasFontStretch) => {
    ctx.font = `${weight} ${size}px ${family}`;
    if ("fontStretch" in ctx) ctx.fontStretch = stretch;
  };

  let y = PAD + sceneH + 92;
  ctx.fillStyle = "#111111";
  setFont(900, 64, "expanded");
  ctx.fillText("MON LOOK DE TECKEL", PAD, y);

  y += 58;
  setFont(500, 32, "normal");
  ctx.fillStyle = "#57534c";
  for (const line of lines.length ? lines : ["Au naturel"]) {
    ctx.fillText(line, PAD, y);
    y += 44;
  }

  setFont(700, 22, "condensed");
  ctx.fillStyle = "#b3122a";
  const stamp = `LE BAR À TECKELS · PARIS 11E · ${new Date().toLocaleDateString("fr-FR")}`;
  ctx.fillText(stamp, PAD, H - 40);

  const link = document.createElement("a");
  link.download = "mon-look-teckel.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}
