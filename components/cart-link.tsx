"use client";

import Link from "next/link";
import { useCart } from "./cart-provider";

export function CartLink() {
  const { count } = useCart();
  return (
    <Link href="/panier" className="btn bg-caramel py-2 text-white hover:bg-caramel-dark">
      Panier
      <span className="rounded-full bg-white/25 px-2 text-xs tabular-nums">{count}</span>
    </Link>
  );
}
