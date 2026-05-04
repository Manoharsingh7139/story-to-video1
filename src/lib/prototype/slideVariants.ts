import type { LayoutId, Slide, SlideContent } from "./types";
import { STOCK_IMAGES, pickRandomImage } from "./stockImages";

const TEXT_VARIANTS: Record<string, { content: SlideContent; script: string }[]> = {
  title: [
    { content: { title: "A New Way to Work", subtitle: "Built around how teams actually think" }, script: "We're rethinking the way modern teams work — together but on their own time." },
    { content: { title: "Async, Done Right", subtitle: "The playbook for distributed teams" }, script: "Let's talk about doing async work the right way — and the playbook that makes it click." },
    { content: { title: "Outwork, Asynchronously", subtitle: "How focused teams pull ahead" }, script: "The teams pulling ahead aren't working more hours. They're working with more focus." },
  ],
  "title-body": [
    { content: { title: "What changed", body: "The companies that lasted didn't just go remote. They redesigned the way decisions get made, where work lives, and how trust is built across time zones." }, script: "Here's what really changed. The lasting companies didn't just go remote — they rebuilt how decisions happen." },
    { content: { title: "The opportunity", body: "When you stop measuring presence and start measuring outcomes, a different kind of team emerges. One that's calmer, faster, and far harder to compete with." }, script: "When you stop measuring presence and start measuring outcomes, an entirely different kind of team shows up." },
  ],
  bullets: [
    { content: { title: "What great teams do", bullets: ["Document decisions in writing", "Default to public channels", "Protect long blocks of focus", "Review outcomes, not hours"] }, script: "Great teams share four habits — they write things down, work in public, protect deep focus, and review outcomes." },
    { content: { title: "Three habits to copy", bullets: ["One source of truth per project", "No-meeting Wednesdays", "Weekly written updates"] }, script: "Copy these three habits and you'll see the difference in two weeks." },
  ],
  stat: [
    { content: { stat: "2.4x", statLabel: "more output from teams that block deep-work hours" }, script: "Teams that protect deep work hours ship over twice as much. The math is brutal — and clear." },
    { content: { stat: "47%", statLabel: "lower attrition in async-first companies" }, script: "Async-first companies see attrition drop almost in half. Talent stays where talent is trusted." },
  ],
  "two-column": [
    { content: { leftTitle: "Old playbook", leftBody: "Sync meetings, status updates, presence as proxy for progress.", rightTitle: "New playbook", rightBody: "Written decisions, async reviews, outcomes as the only signal that matters." }, script: "The old playbook leaned on meetings and presence. The new one runs on writing, async reviews, and outcomes." },
  ],
  divider: [
    { content: { title: "Now the hard part", subtitle: "Turning theory into Monday-morning habits" }, script: "Now the hard part — turning the theory into Monday-morning habits." },
  ],
  "image-left": [
    { content: { title: "Where the work happens", body: "Distributed teams need a single source of truth — a place where decisions live, context is preserved, and anyone can catch up without a meeting.", imageUrl: pickRandomImage() }, script: "Distributed teams need one source of truth — a place where context lives and anyone can catch up." },
  ],
  "image-right": [
    { content: { title: "Trust is the multiplier", body: "When people are trusted to manage their time, they show up with their best work. Surveillance kills the very thing it's trying to measure.", imageUrl: pickRandomImage() }, script: "When people are trusted to manage their time, they show up with their best work." },
  ],
  "image-full": [
    { content: { title: "Build for the long game", subtitle: "The teams that get this right become unfair to compete with", imageUrl: pickRandomImage() }, script: "Build for the long game. The teams that get this right become genuinely unfair to compete with." },
  ],
  "image-grid": [
    { content: {
        title: "What it looks like in practice",
        imageUrl: STOCK_IMAGES[0].url, caption: "Async standups",
        imageUrl2: STOCK_IMAGES[5].url, caption2: "Written decisions",
        imageUrl3: STOCK_IMAGES[7].url, caption3: "Outcome reviews",
        imageUrl4: STOCK_IMAGES[11].url, caption4: "Deep work blocks",
      }, script: "Here's what it looks like in practice — async standups, written decisions, outcome reviews, and protected focus." },
  ],
};

const ALL_LAYOUTS: LayoutId[] = [
  "title", "title-body", "two-column", "bullets", "stat", "divider",
  "image-left", "image-right", "image-full", "image-grid",
];

export function regenerateVariant(slide: Slide, opts: { keepLayout?: boolean; prompt?: string } = {}): Slide {
  const targetLayout: LayoutId = opts.keepLayout
    ? slide.layout
    : ALL_LAYOUTS[Math.floor(Math.random() * ALL_LAYOUTS.length)];

  const variants = TEXT_VARIANTS[targetLayout] ?? TEXT_VARIANTS["title-body"];
  const pick = variants[Math.floor(Math.random() * variants.length)];

  let content = { ...pick.content };
  let script = pick.script;

  if (opts.prompt) {
    const p = opts.prompt.trim();
    if (content.title) content.title = p.length < 60 ? p : content.title;
    script = `Based on your direction — "${p}" — ${script}`;
  }

  return { ...slide, layout: targetLayout, content, script };
}
