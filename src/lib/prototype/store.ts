import { create } from "zustand";
import { SAMPLE_DECK, VOICES } from "./sampleDeck";
import { regenerateVariant } from "./slideVariants";
import type { ChatMessage, ElementKey, Slide, ThemeId, LayoutId, SlideStyle } from "./types";

interface PrototypeState {
  sourceText: string;
  projectTitle: string;
  themeId: ThemeId;
  voice: string;
  voiceMode: "ai" | "upload";
  slides: Slide[];
  selectedSlideId: string;
  selectedElementKey: ElementKey | null;
  chatBySlide: Record<string, ChatMessage[]>;

  setSourceText: (t: string) => void;
  setProjectTitle: (t: string) => void;
  setThemeId: (id: ThemeId) => void;
  setVoice: (v: string) => void;
  setVoiceMode: (m: "ai" | "upload") => void;

  loadSampleDeck: () => void;
  selectSlide: (id: string) => void;
  selectElement: (key: ElementKey | null) => void;
  updateSlide: (id: string, updater: (s: Slide) => Slide) => void;
  setSlideLayout: (id: string, layout: LayoutId) => void;
  setSlideScript: (id: string, script: string) => void;
  setSlideContent: (id: string, key: string, value: string) => void;
  setSlideBullet: (id: string, index: number, value: string) => void;
  setSlideStyle: (id: string, patch: Partial<SlideStyle>) => void;
  addBullet: (id: string) => void;
  removeBullet: (id: string, index: number) => void;
  duplicateBullet: (id: string, index: number) => void;
  reorderBullets: (id: string, from: number, to: number) => void;
  panelSections: Record<string, boolean>;
  setPanelSection: (key: string, open: boolean) => void;
  reorderSlides: (fromId: string, toId: string) => void;
  addSlide: () => void;
  duplicateSlide: (id: string) => void;
  deleteSlide: (id: string) => void;
  regenerateSlide: (id: string, opts?: { keepLayout?: boolean; prompt?: string }) => void;

  pushChat: (slideId: string, msg: ChatMessage) => void;
  applyEditFromChat: (slideId: string, after: Slide, label: string) => void;
  undoEdit: (slideId: string, msgId: string) => void;
}

const initialChatFor = (slideId: string): ChatMessage[] => [
  {
    id: `welcome-${slideId}`,
    role: "assistant",
    text: "Hi! I can edit this slide for you. Try: \"make the title shorter\", \"switch to two-column\", or \"rewrite the script in a casual tone\".",
  },
];

export const usePrototypeStore = create<PrototypeState>((set, get) => ({
  sourceText: "",
  projectTitle: "Untitled video",
  themeId: "studio",
  voice: VOICES[0],
  voiceMode: "ai",
  slides: [],
  selectedSlideId: "",
  selectedElementKey: null,
  chatBySlide: {},

  setSourceText: (t) => set({ sourceText: t }),
  setProjectTitle: (t) => set({ projectTitle: t }),
  setThemeId: (id) => set({ themeId: id }),
  setVoice: (v) => set({ voice: v }),
  setVoiceMode: (m) => set({ voiceMode: m }),

  loadSampleDeck: () => {
    const slides = SAMPLE_DECK.map((s) => ({ ...s, content: { ...s.content } }));
    const chat: Record<string, ChatMessage[]> = {};
    slides.forEach((s) => (chat[s.id] = initialChatFor(s.id)));
    set({
      slides,
      selectedSlideId: SAMPLE_DECK[0].id,
      selectedElementKey: null,
      chatBySlide: chat,
    });
  },

  selectSlide: (id) => set({ selectedSlideId: id, selectedElementKey: null }),
  selectElement: (key) => set({ selectedElementKey: key }),

  updateSlide: (id, updater) =>
    set((state) => ({
      slides: state.slides.map((s) => (s.id === id ? updater(s) : s)),
    })),

  setSlideLayout: (id, layout) =>
    set((state) => ({
      slides: state.slides.map((s) => (s.id === id ? { ...s, layout } : s)),
    })),

  setSlideScript: (id, script) =>
    set((state) => ({
      slides: state.slides.map((s) => (s.id === id ? { ...s, script } : s)),
    })),

  setSlideContent: (id, key, value) =>
    set((state) => ({
      slides: state.slides.map((s) =>
        s.id === id ? { ...s, content: { ...s.content, [key]: value } } : s,
      ),
    })),

  setSlideBullet: (id, index, value) =>
    set((state) => ({
      slides: state.slides.map((s) => {
        if (s.id !== id) return s;
        const bullets = [...(s.content.bullets ?? [])];
        bullets[index] = value;
        return { ...s, content: { ...s.content, bullets } };
      }),
    })),

  setSlideStyle: (id, patch) =>
    set((state) => ({
      slides: state.slides.map((s) =>
        s.id === id
          ? { ...s, content: { ...s.content, style: { ...(s.content.style ?? {}), ...patch } } }
          : s,
      ),
    })),

  addBullet: (id) =>
    set((state) => ({
      slides: state.slides.map((s) =>
        s.id === id
          ? { ...s, content: { ...s.content, bullets: [...(s.content.bullets ?? []), "New point"] } }
          : s,
      ),
    })),

  removeBullet: (id, index) =>
    set((state) => ({
      slides: state.slides.map((s) => {
        if (s.id !== id) return s;
        const bullets = (s.content.bullets ?? []).filter((_, i) => i !== index);
        return { ...s, content: { ...s.content, bullets } };
      }),
    })),

  reorderSlides: (fromId, toId) =>
    set((state) => {
      if (fromId === toId) return state;
      const slides = [...state.slides];
      const fromIdx = slides.findIndex((s) => s.id === fromId);
      const toIdx = slides.findIndex((s) => s.id === toId);
      if (fromIdx < 0 || toIdx < 0) return state;
      const [moved] = slides.splice(fromIdx, 1);
      slides.splice(toIdx, 0, moved);
      return { slides };
    }),

  addSlide: () =>
    set((state) => {
      const id = `s-${Date.now()}`;
      const newSlide: Slide = {
        id,
        layout: "title-body",
        content: { title: "New slide", body: "Click to edit this text." },
        script: "Add your voiceover script here.",
      };
      return {
        slides: [...state.slides, newSlide],
        selectedSlideId: id,
        chatBySlide: { ...state.chatBySlide, [id]: initialChatFor(id) },
      };
    }),

  duplicateSlide: (id) =>
    set((state) => {
      const idx = state.slides.findIndex((s) => s.id === id);
      if (idx < 0) return state;
      const original = state.slides[idx];
      const newId = `s-${Date.now()}`;
      const copy: Slide = {
        ...original,
        id: newId,
        content: { ...original.content, bullets: original.content.bullets ? [...original.content.bullets] : undefined },
      };
      const slides = [...state.slides];
      slides.splice(idx + 1, 0, copy);
      return {
        slides,
        selectedSlideId: newId,
        chatBySlide: { ...state.chatBySlide, [newId]: initialChatFor(newId) },
      };
    }),

  deleteSlide: (id) =>
    set((state) => {
      if (state.slides.length <= 1) return state;
      const idx = state.slides.findIndex((s) => s.id === id);
      const slides = state.slides.filter((s) => s.id !== id);
      const nextSelected =
        state.selectedSlideId === id
          ? slides[Math.min(idx, slides.length - 1)].id
          : state.selectedSlideId;
      const { [id]: _removed, ...restChat } = state.chatBySlide;
      return { slides, selectedSlideId: nextSelected, chatBySlide: restChat };
    }),

  regenerateSlide: (id, opts = {}) =>
    set((state) => {
      const before = state.slides.find((s) => s.id === id);
      if (!before) return state;
      const after = regenerateVariant(before, opts);
      const label = opts.prompt
        ? `Regenerated this slide using your prompt.`
        : opts.keepLayout
          ? `Regenerated this slide (kept the ${before.layout} layout).`
          : `Regenerated this slide with a fresh ${after.layout} layout.`;
      const msg: ChatMessage = {
        id: `regen-${Date.now()}`,
        role: "assistant",
        text: label,
        edit: { before, after },
      };
      return {
        slides: state.slides.map((s) => (s.id === id ? after : s)),
        selectedElementKey: null,
        chatBySlide: {
          ...state.chatBySlide,
          [id]: [...(state.chatBySlide[id] ?? []), msg],
        },
      };
    }),

  pushChat: (slideId, msg) =>
    set((state) => ({
      chatBySlide: {
        ...state.chatBySlide,
        [slideId]: [...(state.chatBySlide[slideId] ?? []), msg],
      },
    })),

  applyEditFromChat: (slideId, after, label) =>
    set((state) => {
      const before = state.slides.find((s) => s.id === slideId);
      if (!before) return state;
      const msg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        text: label,
        edit: { before, after },
      };
      return {
        slides: state.slides.map((s) => (s.id === slideId ? after : s)),
        chatBySlide: {
          ...state.chatBySlide,
          [slideId]: [...(state.chatBySlide[slideId] ?? []), msg],
        },
      };
    }),

  undoEdit: (slideId, msgId) =>
    set((state) => {
      const messages = state.chatBySlide[slideId] ?? [];
      const msg = messages.find((m) => m.id === msgId);
      if (!msg?.edit) return state;
      return {
        slides: state.slides.map((s) => (s.id === slideId ? msg.edit!.before : s)),
        chatBySlide: {
          ...state.chatBySlide,
          [slideId]: messages.map((m) =>
            m.id === msgId ? { ...m, text: m.text + " (undone)", edit: undefined } : m,
          ),
        },
      };
    }),
}));

export const estimateDuration = (script: string) => {
  const words = script.trim().split(/\s+/).filter(Boolean).length;
  const seconds = Math.max(2, Math.round((words / 150) * 60));
  return seconds;
};
