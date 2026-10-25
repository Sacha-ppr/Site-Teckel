"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "ul";
};

// Déclenche "is-in" dès que le bloc entre dans le cadre, une seule fois : le tirage s'expose au défilement.
export function Reveal({ children, className = "", as = "div" }: Props) {
  const ref = useRef<HTMLUListElement & HTMLDivElement>(null);
  const [isIn, setIsIn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || isIn) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIn(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isIn]);

  const cls = `${className} ${isIn ? "is-in" : ""}`.trim();
  if (as === "ul") {
    return (
      <ul ref={ref} className={cls}>
        {children}
      </ul>
    );
  }
  return (
    <div ref={ref} className={cls}>
      {children}
    </div>
  );
}
