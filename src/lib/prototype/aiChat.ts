import type { Slide } from "./types";
import { pickRandomImage } from "./stockImages";

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

  if (/image.*left|left.*image/.test(m)) {
    return {
      after: { ...slide, layout: "image-left", content: { ...slide.content, imageUrl: slide.content.imageUrl ?? pickRandomImage() } },
      label: "Switched to image-on-the-left layout.",
    };
  }
  if (/image.*right|right.*image/.test(m)) {
    return {
      after: { ...slide, layout: "image-right", content: { ...slide.content, imageUrl: slide.content.imageUrl ?? pickRandomImage() } },
      label: "Switched to image-on-the-right layout.",
    };
  }
  if (/full.*image|image.*full|full[- ]bleed/.test(m)) {
    return {
      after: { ...slide, layout: "image-full", content: { ...slide.content, imageUrl: slide.content.imageUrl ?? pickRandomImage() } },
      label: "Switched to a full-bleed image layout.",
    };
  }
  if (/image.*grid|grid.*image|photo grid/.test(m)) {
    return {
      after: {
        ...slide,
        layout: "image-grid",
        content: {
          ...slide.content,
          imageUrl: slide.content.imageUrl ?? pickRandomImage(),
          imageUrl2: slide.content.imageUrl2 ?? pickRandomImage(),
          imageUrl3: slide.content.imageUrl3 ?? pickRandomImage(),
          imageUrl4: slide.content.imageUrl4 ?? pickRandomImage(),
        },
      },
      label: "Switched to a 4-image grid layout.",
    };
  }
  if (/replace.*image|new image|swap.*image|different.*image/.test(m)) {
    return {
      after: { ...slide, content: { ...slide.content, imageUrl: pickRandomImage(slide.content.imageUrl) } },
      label: "Replaced the image.",
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

  // ===== STYLE INTENTS =====
  const setStyle = (patch: Record<string, any>, label: string): ChatResult => ({
    after: { ...slide, content: { ...slide.content, style: { ...(slide.content.style ?? {}), ...patch } } },
    label,
  });
  if (/numbered|number.*bullet|bullets.*number/.test(m)) return setStyle({ bulletVariant: "numbered" }, "Switched bullets to numbered style.");
  if (/process|arrow.*bullet|step.*bullet/.test(m)) return setStyle({ bulletVariant: "process" }, "Turned bullets into a process flow.");
  if (/cards?\b.*bullet|bullets.*cards?/.test(m)) return setStyle({ bulletVariant: "cards" }, "Turned bullets into cards.");
  if (/pillar/.test(m)) return setStyle({ bulletVariant: "pillars" }, "Turned bullets into pillars.");
  if (/checklist|check.*list|tick/.test(m)) return setStyle({ bulletVariant: "checklist" }, "Turned bullets into a checklist.");
  if (/plain.*list|simple.*list|reset.*bullet/.test(m)) return setStyle({ bulletVariant: "list" }, "Reset bullets to a plain list.");

  if (/bigger title|larger title|huge title/.test(m)) return setStyle({ titleSize: "xl" }, "Made the title much bigger.");
  if (/smaller title/.test(m)) return setStyle({ titleSize: "s" }, "Made the title smaller.");
  if (/center.*title|centered title/.test(m)) return setStyle({ titleAlign: "center" }, "Centered the title.");
  if (/right.*title/.test(m)) return setStyle({ titleAlign: "right" }, "Right-aligned the title.");
  if (/accent.*title|colored title|color the title/.test(m)) return setStyle({ titleColor: "accent" }, "Colored the title with the accent color.");

  if (/circle.*image|round.*image|image.*circle/.test(m)) return setStyle({ imageShape: "circle" }, "Made the image circular.");
  if (/blob.*image|image.*blob/.test(m)) return setStyle({ imageShape: "blob" }, "Gave the image a soft-blob shape.");
  if (/rounded.*image|image.*rounded/.test(m)) return setStyle({ imageShape: "rounded" }, "Rounded the image corners.");
  if (/grayscale|black.*white|b\&w|desaturate/.test(m)) return setStyle({ imageTreatment: "grayscale" }, "Applied grayscale to the image.");
  if (/duotone/.test(m)) return setStyle({ imageTreatment: "duotone" }, "Applied a duotone treatment.");

  if (/bigger stat|huge stat|stat.*big/.test(m)) return setStyle({ statSize: "display" }, "Made the stat display-sized.");
  if (/circle.*stat|stat.*circle/.test(m)) return setStyle({ statDecoration: "circle" }, "Wrapped the stat in a circle.");
  if (/underline.*stat|stat.*underline/.test(m)) return setStyle({ statDecoration: "underline" }, "Underlined the stat.");
  if (/gradient.*stat|stat.*gradient/.test(m)) return setStyle({ statDecoration: "gradient" }, "Gave the stat a gradient fill.");

  // Fallback: subtle script tweak so something visible happens
  return {
    after: {
      ...slide,
      script: slide.script.endsWith(".") ? slide.script : slide.script + ".",
    },
    label: "Got it — I tweaked the slide.",
  };
}
