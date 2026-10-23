import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthForm } from "@/components/auth-form";
import { Teckel } from "@/components/teckel";

export const metadata: Metadata = { title: "Inscription" };

export default function Page() {
  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <Teckel className="mx-auto h-14 w-auto" />
      <h1 className="mt-4 text-center font-display text-3xl font-semibold">Rejoignez la meute</h1>
      <p className="mt-2 text-center text-ink-soft">Un compte suffit pour réserver au bar et commander sur la boutique.</p>
      <div className="mt-8 rounded-2xl border border-line bg-paper p-6">
        <Suspense>
          <AuthForm mode="signup" />
        </Suspense>
      </div>
    </div>
  );
}
