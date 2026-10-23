import Image from "next/image";
import { PRODUCT_IMAGES } from "@/lib/product-images";
import { productPhoto } from "@/lib/product-photos";
import { Pose } from "./pose";

type Props = { slug: string; sizes: string; className?: string; priority?: boolean; alt?: string };

// Photo d'un article, en couleur pour qu'on voie la matière et le coloris.
// Sans photo d'article, on retombe sur une pose noir et blanc de teckel.
export function ProductPhoto({ slug, sizes, className = "aspect-square", priority, alt }: Props) {
  const img = PRODUCT_IMAGES[slug];
  if (!img) return <Pose photo={productPhoto(slug)} alt={alt ?? ""} sizes={sizes} className={className} priority={priority} />;
  return (
    <div className={`relative overflow-hidden bg-tirage-2 ${className}`}>
      <Image src={img.src} alt={alt ?? img.alt} fill sizes={sizes} priority={priority} className="object-cover" />
    </div>
  );
}
