"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

// Places restantes par créneau pour un jour donné ; null pendant le chargement.
export function useAvailability(date: string | undefined, refreshKey?: unknown) {
  const [state, setState] = useState<{ date: string; remaining: Record<string, number> } | null>(null);

  useEffect(() => {
    if (!date) return;
    let cancelled = false;
    createClient()
      .rpc("slot_availability", { p_date: date })
      .then(({ data }) => {
        if (cancelled) return;
        const map: Record<string, number> = {};
        for (const row of (data ?? []) as { slot: string; remaining: number }[]) map[row.slot] = row.remaining;
        setState({ date, remaining: map });
      });
    return () => {
      cancelled = true;
    };
  }, [date, refreshKey]);

  return date && state?.date === date ? state.remaining : null;
}
