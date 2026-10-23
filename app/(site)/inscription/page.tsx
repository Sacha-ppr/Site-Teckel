import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthForm } from "@/components/auth-form";
import { Pose } from "@/components/pose";

export const metadata: Metadata = { title: "Inscription" };

export default function Page() {
  return (
    <div className="bg-rouge text-tirage">
      <div className="mx-auto grid max-w-[1100px] items-center gap-12 px-4 py-14 md:grid-cols-[1fr_minmax(0,26rem)] md:px-8 md:py-20">
        <div>
          <h1 className="enseigne text-[clamp(2.6rem,6vw,4.8rem)]">Rejoignez la meute</h1>
          <p className="mt-5 max-w-md text-lg text-rose">Un compte suffit pour réserver au bar et commander sur la boutique.</p>
          <div className="tirage mt-10 hidden w-56 rotate-[-2deg] md:block">
            <Pose photo="rire" alt="" sizes="224px" className="aspect-[4/5]" />
          </div>
        </div>
        <div className="panneau p-6 sm:p-8">
          <Suspense>
            <AuthForm mode="signup" />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
