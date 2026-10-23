import Image from "next/image";
import { PHOTOS, type PhotoId } from "@/lib/photos";

type Props = {
  photo: PhotoId;
  sizes: string;
  className?: string;
  // Rang dans la bande, pour décaler le flash d'arrivée.
  index?: number;
  priority?: boolean;
  alt?: string;
};

// Une pose de cabine : photo noir et blanc recadrée dans son tirage.
export function Pose({ photo, sizes, className = "aspect-[4/5]", index = 0, priority, alt }: Props) {
  const p = PHOTOS[photo];
  return (
    <div className={`relative overflow-hidden bg-encre ${className}`} style={{ "--i": index } as React.CSSProperties}>
      <Image
        src={p.src}
        alt={alt ?? p.alt}
        fill
        sizes={sizes}
        priority={priority}
        className="pose-photo object-cover"
      />
      <span className="pose-flash" aria-hidden />
    </div>
  );
}
