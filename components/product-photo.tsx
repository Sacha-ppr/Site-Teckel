import Image from "next/image";
import { PRODUCT_IMAGES, PRODUCT_WORN } from "@/lib/product-images";
import { productPhoto } from "@/lib/product-photos";
import { Pose } from "./pose";

type Props = { slug: string; sizes: string; className?: string; priority?: boolean; alt?: string; worn?: boolean };

// Photo d'un article, en couleur pour qu'on voie la matière et le coloris.
// Avec `worn`, l'article porté par le teckel apparaît au survol du parent `.group`.
// Sans photo d'article, on retombe sur une pose noir et blanc de teckel.
export function ProductPhoto({ slug, sizes, className = "aspect-square", priority, alt, worn }: Props) {
  const img = PRODUCT_IMAGES[slug];
  if (!img) return <Pose photo={productPhoto(slug)} alt={alt ?? ""} sizes={sizes} className={className} priority={priority} />;
  const onDog = worn ? PRODUCT_WORN[slug] : undefined;
  return (
    <div className={`relative overflow-hidden bg-tirage-2 ${className}`}>
      <Image src={img.src} alt={alt ?? img.alt} fill sizes={sizes} priority={priority} className="object-cover" />
      {onDog ? (
        <Image
          src={onDog.src}
          alt=""
          fill
          sizes={sizes}
          className="object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
        />
      ) : null}
    </div>
  );
}
