import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ProductCard } from "@/components/product-card";
import { ProductView } from "@/components/product-view";
import { CATEGORIES } from "@/lib/catalog";
import { PRODUCT_DETAILS } from "@/lib/product-details";
import { productGallery } from "@/lib/product-images";
import { getProduct, getProducts } from "@/lib/products";

export async function generateMetadata({ params }: PageProps<"/boutique/[slug]">): Promise<Metadata> {
  const product = await getProduct((await params).slug);
  return product ? { title: product.name, description: product.description } : {};
}

export default function Page({ params }: PageProps<"/boutique/[slug]">) {
  return (
    <Suspense fallback={<div className="mx-auto mt-10 h-[40rem] max-w-[1400px] animate-pulse bg-tirage-2" />}>
      <ProductPage params={params} />
    </Suspense>
  );
}

async function ProductPage({ params }: Pick<PageProps<"/boutique/[slug]">, "params">) {
  const { slug } = await params;
  const [product, products] = await Promise.all([getProduct(slug), getProducts()]);
  if (!product) notFound();

  const details = PRODUCT_DETAILS[product.slug] ?? null;
  const pairs = (details?.pairsWith ?? [])
    .map((s) => products.find((p) => p.slug === s))
    .filter((p) => p !== undefined)
    .slice(0, 3);
  const fallbackPairs = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3);
  const suggestions = pairs.length ? pairs : fallbackPairs;

  return (
    <>
      <div className="mx-auto max-w-[1400px] px-4 pt-8 pb-16 md:px-8 md:pb-24">
        <nav aria-label="Fil d'Ariane" className="legende flex flex-wrap items-center gap-2 text-encre-douce">
          <Link href="/boutique" className="hover:text-rouge">
            Boutique
          </Link>
          <span aria-hidden>/</span>
          <span>{CATEGORIES[product.category]}</span>
        </nav>
        <div className="mt-6">
          <ProductView product={product} details={details} images={productGallery(product.slug)} />
        </div>
      </div>

      {details ? (
        <section className="bg-encre text-tirage">
          <div className="mx-auto max-w-[1400px] px-4 py-16 md:px-8 md:py-24">
            <h2 className="enseigne text-[clamp(2.2rem,4.5vw,3.8rem)]">Pensé pour un dos long</h2>
            <ul className="mt-10 grid gap-x-10 gap-y-8 border-t border-[#333] pt-10 md:grid-cols-3">
              {details.points.map((pt) => (
                <li key={pt.title}>
                  <h3 className="enseigne text-[1.5rem] text-jeton">{pt.title}</h3>
                  <p className="mt-3 text-lg text-chrome-clair">{pt.text}</p>
                </li>
              ))}
            </ul>
            <dl className="mt-12 grid gap-6 border-t border-[#333] pt-8 sm:grid-cols-2">
              <div>
                <dt className="legende text-chrome">Matière</dt>
                <dd className="mt-2 text-lg">{details.matiere}</dd>
              </div>
              <div>
                <dt className="legende text-chrome">Entretien</dt>
                <dd className="mt-2 text-lg">{details.entretien}</dd>
              </div>
            </dl>
          </div>
        </section>
      ) : null}

      {suggestions.length ? (
        <section className="bg-tirage">
          <div className="mx-auto max-w-[1400px] px-4 py-16 md:px-8 md:py-24">
            <h2 className="enseigne text-[clamp(2.2rem,4.5vw,3.8rem)]">Complétez le look</h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {suggestions.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
