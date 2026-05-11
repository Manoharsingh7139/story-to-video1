import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { BrandKit } from "./types";

interface BrandState {
  kit: BrandKit;
  update: (patch: Partial<BrandKit>) => void;
  reset: () => void;
}

const DEFAULT_KIT: BrandKit = {
  defaultVoice: "Aurora",
  defaultTheme: "studio",
  defaultPace: "Normal",
  defaultTone: "Warm",
};

export const useBrandKit = create<BrandState>()(
  persist(
    (set) => ({
      kit: DEFAULT_KIT,
      update: (patch) => set((s) => ({ kit: { ...s.kit, ...patch } })),
      reset: () => set({ kit: DEFAULT_KIT }),
    }),
    { name: "cs.brand" },
  ),
);
