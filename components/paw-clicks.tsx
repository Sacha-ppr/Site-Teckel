"use client";

import { useEffect, useRef } from "react";

// Petit tampon de patte qui s'imprime à l'endroit du clic, pour le curseur-patte.
export function PawClicks() {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    function onPointerDown(e: PointerEvent) {
      if (e.pointerType === "touch") return;
      const layer = layerRef.current;
      if (!layer) return;
      const tampon = document.createElement("span");
      tampon.className = "patte-tampon";
      tampon.style.left = `${e.clientX}px`;
      tampon.style.top = `${e.clientY}px`;
      tampon.style.setProperty("--r", `${Math.round(Math.random() * 50 - 25)}deg`);
      tampon.addEventListener("animationend", () => tampon.remove());
      layer.appendChild(tampon);
    }

    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, []);

  return <div ref={layerRef} aria-hidden className="pointer-events-none fixed inset-0 z-[999] overflow-hidden" />;
}
