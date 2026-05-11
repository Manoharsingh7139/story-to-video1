import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { HistoryEntry } from "./types";

interface HistoryState {
  entries: HistoryEntry[];
  push: (e: Omit<HistoryEntry, "id" | "at">) => void;
  clear: () => void;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      entries: [],
      push: (e) =>
        set((s) => ({
          entries: [
            { ...e, id: `h-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, at: Date.now() },
            ...s.entries,
          ].slice(0, 200),
        })),
      clear: () => set({ entries: [] }),
    }),
    { name: "cs.history" },
  ),
);

export const logHistory = (e: Omit<HistoryEntry, "id" | "at">) => useHistoryStore.getState().push(e);
