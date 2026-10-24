"use client";

import Link from "next/link";
import { useCart } from "./cart-provider";

export function CartLink() {
  const { count } = useCart();
  return (
    <Link href="/panier" className="legende flex items-center gap-2 hover:text-jeton">
      Panier
      <span
        className="grid h-7 min-w-7 place-items-center rounded-full bg-jeton px-1.5 text-[0.8rem] tracking-normal text-encre tabular-nums"
        aria-label={`${count} article${count > 1 ? "s" : ""}`}
      >
        {count}
      </span>
    </Link>
  );
}
