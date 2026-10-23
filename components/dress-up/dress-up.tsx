"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import type { ChangeEvent, KeyboardEvent, PointerEvent as ReactPointerEvent } from "react";
import { useCart } from "@/components/cart-provider";
import { formatPrice, type Product } from "@/lib/catalog";
import {
  CATEGORIES,
  DEFAULT_LANDMARKS,
  GARMENTS,
  MODELS,
  garment,
  placeGarment,
  type Category,
  type GarmentId,
  type ModelId,
  type Placement,
  type Slot,
} from "@/lib/dress-up";
import { ProductPhoto } from "@/components/product-photo";
import { PRODUCT_IMAGES } from "@/lib/product-images";
import { Backdrop, GarmentSvg } from "./garment-art";

// Une pièce posée sur la scène : sa place de départ, puis les réglages du visiteur.
type Layer = {
  id: GarmentId;
  base: Placement;
  dx: number;
  dy: number;
  size: number;
  length: number;
  rot: number;
  flip: boolean;
};

type Subject = { kind: "model"; id: ModelId } | { kind: "photo"; url: string };

const SLOT_ORDER: Slot[] = ["haut", "harnais", "cou", "lunettes", "chapeau"];
const BODY_SLOTS: Slot[] = ["haut", "harnais"];

export function DressUp({ products }: { products: Product[] }) {
  const uid = useId().replace(/:/g, "");
  const router = useRouter();
  const { add } = useCart();
  const [subject, setSubject] = useState<Subject>({ kind: "model", id: "fauve" });
  const [dogName, setDogName] = useState("");
  // Arrivée depuis une fiche produit (?essayer=harnais) : la pièce est déjà enfilée.
  const essayer = useSearchParams().get("essayer");
  const tryOn = GARMENTS.find((g) => g.id === essayer) ?? null;
  const [layers, setLayers] = useState<Partial<Record<Slot, Layer>>>(() =>
    tryOn ? { [tryOn.slot]: { id: tryOn.id, base: placeGarment(tryOn, MODELS[0].landmarks), dx: 0, dy: 0, size: 1, length: 1, rot: 0, flip: false } } : {},
  );
  const [selected, setSelected] = useState<Slot | null>(tryOn?.slot ?? null);
  const [tab, setTab] = useState<Category>(tryOn?.category ?? "hauts");
  const [flashKey, setFlashKey] = useState(0);
  const [added, setAdded] = useState<string | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const svgRefs = useRef<Partial<Record<Slot, SVGSVGElement | null>>>({});
  const drag = useRef<{ slot: Slot; x: number; y: number; dx: number; dy: number } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const model = subject.kind === "model" ? MODELS.find((m) => m.id === subject.id)! : null;
  const landmarks = model?.landmarks ?? DEFAULT_LANDMARKS;
  const fit = model ? "photo" : "gabarit";

  // La photo du modèle en data URI : elle ombre les tissus et reste lisible dans l'export PNG.
  const [shadeSrc, setShadeSrc] = useState<{ image: string; href: string } | null>(null);
  useEffect(() => {
    if (!model) return;
    let cancelled = false;
    fetch(model.image)
      .then((r) => r.blob())
      .then(
        (blob) =>
          new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result));
            reader.readAsDataURL(blob);
          }),
      )
      .then((href) => {
        if (!cancelled) setShadeSrc({ image: model.image, href });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [model]);
  const shadeHref = model && shadeSrc?.image === model.image ? shadeSrc.href : null;

  // Libère l'URL locale de la photo quand elle est remplacée.
  useEffect(() => {
    if (subject.kind !== "photo") return;
    return () => URL.revokeObjectURL(subject.url);
  }, [subject]);

  const bySlug = new Map(products.map((p) => [p.slug, p]));
  const worn = SLOT_ORDER.filter((s) => layers[s]).map((s) => garment(layers[s]!.id));
  const wornProducts = worn.map((g) => ({ garment: g, product: bySlug.get(g.productSlug) }));
  const buyable = wornProducts.filter((w) => w.product && w.product.stock > 0);
  const total = buyable.reduce((n, w) => n + w.product!.price_cents, 0);
  const name = dogName.trim();

  const fresh = (id: GarmentId): Layer => ({
    id,
    base: placeGarment(garment(id), landmarks),
    dx: 0,
    dy: 0,
    size: 1,
    length: 1,
    rot: 0,
    flip: false,
  });

  // Changer de chien replace chaque pièce sur sa nouvelle silhouette.
  const changeSubject = (next: Subject) => {
    const lm = next.kind === "model" ? MODELS.find((m) => m.id === next.id)!.landmarks : DEFAULT_LANDMARKS;
    setSubject(next);
    setLayers((current) => {
      const out: Partial<Record<Slot, Layer>> = {};
      for (const [slot, layer] of Object.entries(current) as [Slot, Layer][]) {
        out[slot] = { ...layer, base: placeGarment(garment(layer.id), lm), dx: 0, dy: 0, size: 1, length: 1, rot: 0 };
      }
      return out;
    });
  };

  const remove = (slot: Slot) => {
    setLayers((current) => {
      const next = { ...current };
      delete next[slot];
      return next;
    });
    setSelected((s) => (s === slot ? null : s));
  };

  const toggle = (id: GarmentId) => {
    const { slot } = garment(id);
    if (layers[slot]?.id === id) {
      remove(slot);
      return;
    }
    setLayers((current) => ({ ...current, [slot]: fresh(id) }));
    setSelected(slot);
  };

  const update = (slot: Slot, patch: Partial<Layer>) =>
    setLayers((current) => (current[slot] ? { ...current, [slot]: { ...current[slot]!, ...patch } } : current));

  const onUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !file.type.startsWith("image/")) return;
    changeSubject({ kind: "photo", url: URL.createObjectURL(file) });
  };

  // Glisser une pièce sur la scène.
  const onPointerDown = (slot: Slot) => (e: ReactPointerEvent) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    const layer = layers[slot]!;
    drag.current = { slot, x: e.clientX, y: e.clientY, dx: layer.dx, dy: layer.dy };
    setSelected(slot);
  };
  const onPointerMove = (e: ReactPointerEvent) => {
    const d = drag.current;
    const stage = stageRef.current;
    if (!d || !stage) return;
    const r = stage.getBoundingClientRect();
    update(d.slot, {
      dx: d.dx + ((e.clientX - d.x) / r.width) * 100,
      dy: d.dy + ((e.clientY - d.y) / r.height) * 100,
    });
  };
  const onPointerUp = () => {
    drag.current = null;
  };

  // Au clavier : flèches pour déplacer la pièce sélectionnée, Suppr pour la retirer.
  const onLayerKey = (slot: Slot) => (e: KeyboardEvent) => {
    const step = e.shiftKey ? 2 : 0.5;
    const l = layers[slot]!;
    const moves: Record<string, Partial<Layer>> = {
      ArrowLeft: { dx: l.dx - step },
      ArrowRight: { dx: l.dx + step },
      ArrowUp: { dy: l.dy - step * 1.5 },
      ArrowDown: { dy: l.dy + step * 1.5 },
    };
    if (moves[e.key]) {
      e.preventDefault();
      update(slot, moves[e.key]);
    } else if (e.key === "Delete" || e.key === "Backspace") {
      e.preventDefault();
      remove(slot);
    }
  };

  const addProduct = (product: Product) =>
    add({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      priceCents: product.price_cents,
      color: product.color,
    });

  const buyLook = () => {
    for (const { product } of buyable) addProduct(product!);
    router.push("/panier");
  };

  const download = async () => {
    setFlashKey((k) => k + 1);
    await exportLook({
      backdropSvg: model ? (stageRef.current?.querySelector("[data-backdrop]") as SVGSVGElement | null) : null,
      subject: model ? model.image : subject.kind === "photo" ? subject.url : null,
      mask: model ? model.image : null,
      layers: SLOT_ORDER.filter((s) => layers[s]).map((s) => ({
        slot: s,
        layer: layers[s]!,
        svg: svgRefs.current[s] ?? null,
      })),
      title: name ? `Le look de ${name}` : "Mon look de teckel",
      lines: worn.map((g) => {
        const p = bySlug.get(g.productSlug);
        return p ? `${p.name} · ${formatPrice(p.price_cents)}` : g.label;
      }),
    });
  };

  const renderLayer = (slot: Slot) => {
    const layer = layers[slot];
    if (!layer) return null;
    const g = garment(layer.id);
    const { x, y, w, h } = layer.base;
    const isSelected = selected === slot;
    const wEff = w * layer.size * (BODY_SLOTS.includes(slot) ? layer.length : 1);
    const hEff = h * layer.size;
    // Recale la photo entière dans le repère SVG de la pièce, pour en reprendre ombres et reflets.
    const [bx, by, bw, bh] = g.box;
    const ux = bw / wEff;
    const uy = bh / hEff;
    const shade =
      slot === "haut" && model && shadeHref
        ? {
            href: shadeHref,
            x: bx - (x + layer.dx - wEff / 2) * ux,
            y: by - (y + layer.dy - hEff / 2) * uy,
            width: 100 * ux,
            height: 100 * uy,
            transform: layer.flip ? `translate(${2 * bx + bw} 0) scale(-1 1)` : undefined,
            gain: model.shadeGain,
          }
        : undefined;
    return (
      <div
        key={slot}
        role="button"
        tabIndex={0}
        aria-label={`${g.label} : glisser ou utiliser les flèches pour ajuster`}
        aria-pressed={isSelected}
        onPointerDown={onPointerDown(slot)}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={onLayerKey(slot)}
        onFocus={() => setSelected(slot)}
        className="absolute cursor-grab touch-none outline-none active:cursor-grabbing"
        style={{
          left: `${x + layer.dx}%`,
          top: `${y + layer.dy}%`,
          width: `${wEff}%`,
          height: `${hEff}%`,
          transform: `translate(-50%, -50%) rotate(${layer.base.rot + layer.rot}deg) scaleX(${layer.flip ? -1 : 1})`,
          filter: "drop-shadow(0 3px 3px rgb(0 0 0 / 0.3))",
        }}
      >
        <GarmentSvg
          id={layer.id}
          box={g.box}
          uid={`${uid}-${slot}`}
          fit={fit}
          shade={shade}
          stretch
          className="block h-full w-full overflow-visible"
          svgRef={(el) => {
            svgRefs.current[slot] = el;
          }}
        />
        {isSelected ? (
          <span className="pointer-events-none absolute -inset-1.5 rounded-md border-2 border-dashed border-jeton" aria-hidden />
        ) : null}
      </div>
    );
  };

  const sel = selected ? layers[selected] : undefined;
  const selGarment = sel ? garment(sel.id) : null;

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:grid-rows-[auto_1fr] lg:gap-x-12">
      {/* La cabine : le teckel pose, on ajuste chaque pièce à la main. */}
      <div className="sticky top-[100px] z-10 order-1 xl:top-24 lg:col-start-1 lg:row-start-1">
        <div className="tirage">
          <div
            ref={stageRef}
            className="relative aspect-[3/2] w-full overflow-hidden bg-rouge-fonce select-none"
            onPointerDown={(e) => {
              if (e.target === e.currentTarget) setSelected(null);
            }}
          >
            {model ? (
              <>
                <svg data-backdrop viewBox="0 0 420 260" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
                  <Backdrop uid={`${uid}-studio`} />
                </svg>
                {/* eslint-disable-next-line @next/next/no-img-element -- image détourée calée au pixel, même source que le masque */}
                <img src={model.image} alt={`Teckel ${model.label.toLowerCase()} de profil`} className="pointer-events-none absolute inset-0 h-full w-full" draggable={false} />
              </>
            ) : subject.kind === "photo" ? (
              // eslint-disable-next-line @next/next/no-img-element -- photo locale du visiteur (URL blob)
              <img src={subject.url} alt={name ? `Photo de ${name}` : "Photo de votre teckel"} className="pointer-events-none absolute inset-0 h-full w-full object-cover" draggable={false} />
            ) : null}

            {/* Les pièces de corps sont découpées par la vraie silhouette du chien détouré. */}
            <div
              className="pointer-events-none absolute inset-0 [&>*]:pointer-events-auto"
              style={
                model
                  ? {
                      maskImage: `url(${model.image})`,
                      WebkitMaskImage: `url(${model.image})`,
                      maskSize: "100% 100%",
                      WebkitMaskSize: "100% 100%",
                    }
                  : undefined
              }
            >
              {BODY_SLOTS.map(renderLayer)}
            </div>
            {SLOT_ORDER.filter((s) => !BODY_SLOTS.includes(s)).map(renderLayer)}

            <span key={flashKey} className={`pose-flash ${flashKey ? "pose-flash-clic" : ""}`} aria-hidden />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 px-1 pt-3">
            <p className="legende text-encre-douce">{name ? `Le look de ${name}` : "Glissez une pièce pour l'ajuster"}</p>
            <p className="legende text-encre-douce tabular-nums">{worn.length} / 5 pièces</p>
          </div>
        </div>

      </div>

      <div className="order-3 flex flex-col gap-6 lg:col-start-2 lg:row-span-2 lg:row-start-1">
        <div className="panneau p-4 sm:p-6">
          <h2 className="enseigne text-[1.5rem]">Votre teckel</h2>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4" role="radiogroup" aria-label="Teckel à habiller">
            {MODELS.map((m) => {
              const on = subject.kind === "model" && subject.id === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => changeSubject({ kind: "model", id: m.id })}
                  className={`rounded-xl p-2 text-left transition-colors ${on ? "bg-jeton text-encre" : "bg-case text-chrome-clair hover:bg-[#363636]"}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- vignette de l'image détourée */}
                  <img src={m.image} alt="" className="aspect-[3/2] w-full object-contain" />
                  <span className="mt-1 block text-[0.8rem] leading-tight font-bold">{m.label}</span>
                </button>
              );
            })}
            <button
              type="button"
              role="radio"
              aria-checked={subject.kind === "photo"}
              onClick={() => fileRef.current?.click()}
              className={`flex flex-col justify-between rounded-xl border-2 border-dashed p-2 text-left ${
                subject.kind === "photo" ? "border-jeton bg-jeton text-encre" : "border-chrome text-chrome-clair hover:bg-case"
              }`}
            >
              <svg viewBox="0 0 24 24" className="mx-auto my-2 size-8" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                <path d="M4 8h3l2-2.5h6L17 8h3v11H4z" strokeLinejoin="round" />
                <circle cx="12" cy="13" r="3.5" />
              </svg>
              <span className="block text-[0.8rem] leading-tight font-bold">{subject.kind === "photo" ? "Changer la photo" : "Mon teckel en photo"}</span>
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="sr-only" onChange={onUpload} tabIndex={-1} aria-hidden />
          </div>
          <p className="mt-3 text-sm text-chrome-clair">
            {subject.kind === "photo"
              ? "Votre photo reste sur votre appareil : rien n'est envoyé. Glissez chaque pièce pour l'ajuster à votre teckel."
              : "Ajoutez une photo de profil de votre teckel, tête à droite, pour l'habiller lui."}
          </p>
          <label className="mt-4 flex flex-col gap-1.5 text-sm font-bold">
            Son prénom
            <input value={dogName} onChange={(e) => setDogName(e.target.value)} maxLength={24} placeholder="Chorizo, Biscotte, Monsieur Saucisse…" className="field" />
          </label>

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
                className={`btn px-4 py-2 text-[0.8rem] ${tab === c.id ? "bg-jeton text-encre" : "border-2 border-chrome text-chrome-clair hover:bg-case"}`}
              >
                {c.label}
              </button>
            ))}
          </div>
          <ul id={`${uid}-panel`} role="tabpanel" aria-labelledby={`${uid}-tab-${tab}`} className="mt-4 grid grid-cols-3 gap-2">
            {GARMENTS.filter((g) => g.category === tab).map((g) => {
              const on = layers[g.slot]?.id === g.id;
              const p = bySlug.get(g.productSlug);
              return (
                <li key={g.id}>
                  <button
                    type="button"
                    onClick={() => toggle(g.id)}
                    aria-pressed={on}
                    className={`flex h-full w-full flex-col items-center gap-2 rounded-xl p-3 ${on ? "bg-jeton text-encre" : "bg-case text-chrome-clair hover:bg-[#363636]"}`}
                  >
                    <span className="block h-14 w-full">
                      <GarmentSvg id={g.id} box={g.box} uid={`${uid}-ico-${g.id}`} sleeves className="h-full w-full" />
                    </span>
                    <span className="text-center text-[0.8rem] leading-tight font-bold">{g.label}</span>
                    <span className="text-[0.75rem] tabular-nums opacity-80">{p ? formatPrice(p.price_cents) : "Bientôt"}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* La passerelle boutique : ce que porte le teckel, avec les vrais prix. */}
        <section aria-labelledby={`${uid}-look`}>
          <h2 id={`${uid}-look`} className="enseigne text-[1.8rem]">
            {name ? `Le look de ${name}` : "Le look"}
          </h2>
          {worn.length === 0 ? (
            <p className="mt-4 border-y-2 border-encre py-5 text-encre-douce">
              {name ? `${name} ne porte rien pour l'instant.` : "Votre teckel ne porte rien pour l'instant."} Choisissez une pièce dans le
              dressing.
            </p>
          ) : (
            <ul className="mt-4 border-t-2 border-encre" aria-live="polite">
              {wornProducts.map(({ garment: g, product }) => (
                <li
                  key={g.id}
                  onMouseEnter={() => setSelected(g.slot)}
                  className={`grid grid-cols-[4.5rem_1fr_auto] gap-x-4 gap-y-2 border-b-2 border-encre py-4 ${selected === g.slot ? "bg-jeton/15" : ""}`}
                >
                  {/* La vraie photo de l'article quand on l'a : c'est elle qui donne envie. */}
                  {PRODUCT_IMAGES[g.productSlug] ? (
                    <ProductPhoto slug={g.productSlug} sizes="72px" className="row-span-2 aspect-square rounded-lg" alt="" />
                  ) : (
                    <div className="row-span-2 grid aspect-square place-items-center rounded-lg bg-tirage-2 p-1.5">
                      <GarmentSvg id={g.id} box={g.box} uid={`${uid}-look-${g.id}`} sleeves className="h-full w-full" />
                    </div>
                  )}
                  <div className="min-w-0">
                    {product ? (
                      <Link href={`/boutique/${product.slug}`} className="leading-snug font-bold hover:text-rouge">
                        {product.name}
                      </Link>
                    ) : (
                      <span className="font-bold">{g.label}</span>
                    )}
                    <p className="mt-1 line-clamp-2 text-sm text-encre-douce">{product ? product.description : "Bientôt en boutique."}</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="pt-0.5 text-lg font-extrabold tabular-nums [font-stretch:80%]">{product ? formatPrice(product.price_cents) : "–"}</span>
                    <button
                      type="button"
                      onClick={() => remove(g.slot)}
                      className="grid size-8 shrink-0 place-items-center rounded-full border-2 border-encre hover:bg-jeton"
                      aria-label={`Retirer : ${g.label}`}
                    >
                      <svg viewBox="0 0 16 16" className="size-3" aria-hidden fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M4 4l8 8M12 4l-8 8" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>
                  <div className="col-span-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                    {product && product.stock > 0 ? (
                      <>
                        <span className="legende text-encre-douce">
                          {product.stock > 5 ? "En stock · expédié sous 48 h" : `Plus que ${product.stock} en stock`}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            addProduct(product);
                            setAdded(g.id);
                            setTimeout(() => setAdded((v) => (v === g.id ? null : v)), 1500);
                          }}
                          className={`btn px-3.5 py-1.5 text-[0.75rem] ${added === g.id ? "bg-jeton text-encre" : "btn-ligne"}`}
                        >
                          {added === g.id ? "Dans le panier" : "Ajouter au panier"}
                        </button>
                      </>
                    ) : (
                      <span className="legende text-encre-douce">{product ? "Épuisé pour le moment" : "Pas encore en vente"}</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
            <p className="flex items-baseline gap-3">
              <span className="text-[2.4rem] leading-none font-extrabold tabular-nums [font-stretch:80%]">{formatPrice(total)}</span>
              <span className="text-sm text-encre-douce">
                {buyable.length} article{buyable.length > 1 ? "s" : ""} disponible{buyable.length > 1 ? "s" : ""}
              </span>
            </p>
            {buyable.length > 0 ? (
              <button type="button" onClick={buyLook} className="btn btn-encre">
                {name ? `Habiller ${name} pour de vrai` : "Acheter ce look"}
              </button>
            ) : (
              <Link href="/boutique" className="btn btn-ligne">
                Voir les articles en boutique
              </Link>
            )}
          </div>
        </section>
      </div>

      <div className="order-2 flex flex-col gap-4 lg:col-start-1 lg:row-start-2">
        {/* Réglages de la pièce sélectionnée */}
        {sel && selGarment && selected ? (
          <div className="panneau p-4" role="group" aria-label={`Ajuster : ${selGarment.label}`}>
            <div className="flex items-center justify-between gap-3">
              <p className="enseigne text-[1.1rem]">{selGarment.label}</p>
              <button
                type="button"
                onClick={() => update(selected, { dx: 0, dy: 0, size: 1, length: 1, rot: 0, flip: false })}
                className="legende text-chrome-clair underline hover:text-jeton"
              >
                Recaler
              </button>
            </div>
            <div className="mt-3 grid gap-x-6 gap-y-3 sm:grid-cols-2">
              <Range label="Taille" value={sel.size} min={0.5} max={1.8} step={0.02} onChange={(v) => update(selected, { size: v })} format={(v) => `${Math.round(v * 100)} %`} />
              {BODY_SLOTS.includes(selected) ? (
                <Range label="Longueur du dos" value={sel.length} min={0.7} max={1.4} step={0.02} onChange={(v) => update(selected, { length: v })} format={(v) => `${Math.round(v * 100)} %`} />
              ) : null}
              <Range label="Rotation" value={sel.rot} min={-35} max={35} step={1} onChange={(v) => update(selected, { rot: v })} format={(v) => `${v}°`} />
              <div className="flex items-end gap-2">
                <button
                  type="button"
                  onClick={() => update(selected, { flip: !sel.flip })}
                  aria-pressed={sel.flip}
                  className={`btn px-4 py-2 text-[0.75rem] ${sel.flip ? "bg-jeton text-encre" : "border-2 border-chrome text-chrome-clair"}`}
                >
                  Miroir
                </button>
                <button type="button" onClick={() => remove(selected)} className="btn border-2 border-chrome px-4 py-2 text-[0.75rem] text-chrome-clair">
                  Retirer
                </button>
              </div>
            </div>
          </div>
        ) : null}
        <div className="flex flex-wrap gap-3">
        <button type="button" onClick={download} className="btn btn-jeton">
          Télécharger la photo
        </button>
        <button
          type="button"
          onClick={() => {
            setLayers({});
            setSelected(null);
          }}
          disabled={worn.length === 0}
          className="btn btn-ligne"
        >
          Tout enlever
        </button>
        </div>
      </div>
    </div>
  );
}

function Range({
  label,
  value,
  min,
  max,
  step,
  onChange,
  format,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  format: (v: number) => string;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="flex justify-between text-chrome-clair">
        <span className="legende">{label}</span>
        <span className="tabular-nums">{format(value)}</span>
      </span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="accent-jeton" />
    </label>
  );
}

// ——— Export : la photo du look, composée dans un canvas ———

const EXPORT_W = 1500;
const EXPORT_H = 1000;

async function loadImage(src: string) {
  const img = new Image();
  img.src = src;
  await img.decode();
  return img;
}

async function svgToImage(svg: SVGSVGElement, width: number, height: number) {
  const clone = svg.cloneNode(true) as SVGSVGElement;
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  clone.setAttribute("width", String(Math.max(1, Math.round(width))));
  clone.setAttribute("height", String(Math.max(1, Math.round(height))));
  const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(clone)], { type: "image/svg+xml" }));
  try {
    return await loadImage(url);
  } finally {
    URL.revokeObjectURL(url);
  }
}

function drawCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, w: number, h: number) {
  const s = Math.max(w / img.naturalWidth, h / img.naturalHeight);
  const iw = img.naturalWidth * s;
  const ih = img.naturalHeight * s;
  ctx.drawImage(img, (w - iw) / 2, (h - ih) / 2, iw, ih);
}

async function drawLayer(ctx: CanvasRenderingContext2D, slot: Slot, layer: Layer, svg: SVGSVGElement) {
  const { x, y, w, h, rot } = layer.base;
  const pw = (w * layer.size * (BODY_SLOTS.includes(slot) ? layer.length : 1) * EXPORT_W) / 100;
  const ph = (h * layer.size * EXPORT_H) / 100;
  const img = await svgToImage(svg, pw, ph);
  ctx.save();
  ctx.translate(((x + layer.dx) * EXPORT_W) / 100, ((y + layer.dy) * EXPORT_H) / 100);
  ctx.rotate(((rot + layer.rot) * Math.PI) / 180);
  ctx.scale(layer.flip ? -1 : 1, 1);
  ctx.drawImage(img, -pw / 2, -ph / 2, pw, ph);
  ctx.restore();
}

async function exportLook(opts: {
  backdropSvg: SVGSVGElement | null;
  subject: string | null;
  mask: string | null;
  layers: { slot: Slot; layer: Layer; svg: SVGSVGElement | null }[];
  title: string;
  lines: string[];
}) {
  // La scène, à sa taille réelle.
  const scene = document.createElement("canvas");
  scene.width = EXPORT_W;
  scene.height = EXPORT_H;
  const sctx = scene.getContext("2d");
  if (!sctx) return;
  sctx.fillStyle = "#8c0c1f";
  sctx.fillRect(0, 0, EXPORT_W, EXPORT_H);
  if (opts.backdropSvg) sctx.drawImage(await svgToImage(opts.backdropSvg, EXPORT_W, EXPORT_H), 0, 0, EXPORT_W, EXPORT_H);
  if (opts.subject) {
    const img = await loadImage(opts.subject);
    if (opts.mask) sctx.drawImage(img, 0, 0, EXPORT_W, EXPORT_H);
    else drawCover(sctx, img, EXPORT_W, EXPORT_H);
  }

  // Pièces de corps : découpées par la silhouette du chien quand on l'a.
  const body = document.createElement("canvas");
  body.width = EXPORT_W;
  body.height = EXPORT_H;
  const bctx = body.getContext("2d")!;
  bctx.shadowColor = "rgba(0,0,0,0.3)";
  bctx.shadowBlur = 6;
  bctx.shadowOffsetY = 3;
  for (const { slot, layer, svg } of opts.layers) {
    if (BODY_SLOTS.includes(slot) && svg) await drawLayer(bctx, slot, layer, svg);
  }
  if (opts.mask) {
    bctx.globalCompositeOperation = "destination-in";
    bctx.shadowColor = "transparent";
    bctx.drawImage(await loadImage(opts.mask), 0, 0, EXPORT_W, EXPORT_H);
  }
  sctx.drawImage(body, 0, 0);
  sctx.shadowColor = "rgba(0,0,0,0.3)";
  sctx.shadowBlur = 6;
  sctx.shadowOffsetY = 3;
  for (const { slot, layer, svg } of opts.layers) {
    if (!BODY_SLOTS.includes(slot) && svg) await drawLayer(sctx, slot, layer, svg);
  }

  // Le tirage : la scène, puis la légende du look.
  const PAD = 56;
  const W = 1200;
  const sceneW = W - PAD * 2;
  const sceneH = (sceneW * EXPORT_H) / EXPORT_W;
  const H = PAD + sceneH + 150 + Math.max(opts.lines.length, 1) * 44 + 80;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#fffefa";
  ctx.fillRect(0, 0, W, H);
  ctx.drawImage(scene, PAD, PAD, sceneW, sceneH);

  // La police du site est déjà chargée : le canvas peut l'utiliser.
  const family = getComputedStyle(document.body).fontFamily;
  const setFont = (weight: number, size: number, stretch: CanvasFontStretch) => {
    ctx.font = `${weight} ${size}px ${family}`;
    if ("fontStretch" in ctx) ctx.fontStretch = stretch;
  };
  let y = PAD + sceneH + 92;
  ctx.fillStyle = "#111111";
  setFont(900, 60, "expanded");
  ctx.fillText(opts.title.toUpperCase(), PAD, y, W - PAD * 2);
  y += 58;
  setFont(500, 32, "normal");
  ctx.fillStyle = "#57534c";
  for (const line of opts.lines.length ? opts.lines : ["Au naturel"]) {
    ctx.fillText(line, PAD, y);
    y += 44;
  }
  setFont(700, 22, "condensed");
  ctx.fillStyle = "#b3122a";
  ctx.fillText(`LE BAR À TECKELS · CABINE D'ESSAYAGE · ${new Date().toLocaleDateString("fr-FR")}`, PAD, H - 40);

  const link = document.createElement("a");
  link.download = "look-teckel.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}
