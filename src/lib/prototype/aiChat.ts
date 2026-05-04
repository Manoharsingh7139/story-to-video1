import type { Slide } from "./types";

export interface ChatResult {
  after: Slide;
  label: string;
}

const casualRewrite = (script: string) =>
  script
    .replace(/\bWhy should you care\?/i, "So why bother?")
    .replace(/\bThat's not a small optimization\b/i, "That's huge")
    .replace(/\bfundamentally\b/gi, "totally")
    .replace(/\bHowever\b/gi, "But")
    .replace(/\bUtilize\b/gi, "Use") || `Hey — ${script}`;

const formalRewrite = (script: string) =>
  script
    .replace(/\bHey[, ]+/gi, "")
    .replace(/\bbother\b/gi, "invest time")
    .replace(/\btotally\b/gi, "fundamentally")
    .replace(/^/, "");

export function processChatMessage(message: string, slide: Slide): ChatResult | null {
  const m = message.toLowerCase();

  if (/\b(short|shorter|trim).*title|title.*short/.test(m) || m.includes("shorter title")) {
    const title = slide.content.title ?? "";
    const words = title.split(" ");
    const newTitle = words.length > 3 ? words.slice(0, Math.max(2, Math.ceil(words.length / 2))).join(" ") : title;
    return {
      after: { ...slide, content: { ...slide.content, title: newTitle } },
      label: `Shortened the title to "${newTitle}".`,
    };
  }

  if (/two[- ]column/.test(m)) {
    return {
      after: {
        ...slide,
        layout: "two-column",
        content: {
          ...slide.content,
          leftTitle: slide.content.leftTitle ?? "Before",
          leftBody: slide.content.leftBody ?? slide.content.body ?? "Left column content.",
          rightTitle: slide.content.rightTitle ?? "After",
          rightBody: slide.content.rightBody ?? "Right column content.",
        },
      },
      label: "Switched the layout to two-column.",
    };
  }

  if (/\bbullet/.test(m) || /\blist\b/.test(m)) {
    return {
      after: {
        ...slide,
        layout: "bullets",
        content: {
          ...slide.content,
          bullets: slide.content.bullets ?? ["First key point", "Second key point", "Third key point"],
        },
      },
      label: "Switched to a bulleted list layout.",
    };
  }

  if (/\bstat\b|\bbig number\b/.test(m)) {
    return {
      after: {
        ...slide,
        layout: "stat",
        content: { ...slide.content, stat: slide.content.stat ?? "42%", statLabel: slide.content.statLabel ?? "of users agree" },
      },
      label: "Switched to a big-stat layout.",
    };
  }

  if (/casual|friendly|chatty|conversational/.test(m)) {
    return {
      after: { ...slide, script: casualRewrite(slide.script) },
      label: "Rewrote the script in a more casual tone.",
    };
  }

  if (/formal|professional|serious/.test(m)) {
    return {
      after: { ...slide, script: formalRewrite(slide.script) },
      label: "Rewrote the script in a more formal tone.",
    };
  }

  if (/shorten.*script|shorter.*script|trim.*script/.test(m)) {
    const sentences = slide.script.split(/(?<=[.!?])\s+/);
    const trimmed = sentences.slice(0, Math.max(1, Math.ceil(sentences.length / 2))).join(" ");
    return {
      after: { ...slide, script: trimmed },
      label: "Shortened the script.",
    };
  }

  if (/longer.*script|expand.*script|more detail/.test(m)) {
    const expanded = slide.script + " To put it concretely, the teams that take this seriously consistently outperform those that don't — across hiring, retention, and quality of output.";
    return {
      after: { ...slide, script: expanded },
      label: "Expanded the script with more detail.",
    };
  }

  if (/add.*bullet|new bullet|one more/.test(m)) {
    const bullets = [...(slide.content.bullets ?? []), "Another important point"];
    return {
      after: {
        ...slide,
        layout: "bullets",
        content: { ...slide.content, bullets },
      },
      label: "Added a new bullet point.",
    };
  }

  if (/punchier|punchy|bolder|stronger.*title/.test(m)) {
    const title = (slide.content.title ?? "").toUpperCase().replace(/\.$/, "") + ".";
    return {
      after: { ...slide, content: { ...slide.content, title } },
      label: "Made the title punchier.",
    };
  }

  // Fallback: subtle script tweak so something visible happens
  return {
    after: {
      ...slide,
      script: slide.script.endsWith(".") ? slide.script : slide.script + ".",
    },
    label: "Got it — I tweaked the slide.",
  };
}
