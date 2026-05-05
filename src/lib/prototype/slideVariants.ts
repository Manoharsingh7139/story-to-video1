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
  "image-bg-overlay": [
    { content: { title: "Strategy starts with seeing clearly", body: "Before you can act, you have to look honestly at where you stand and where the market is going.", imageUrl: pickRandomImage() }, script: "Strategy always starts with seeing clearly — what you've got, and where the world is heading." },
  ],
  "image-text-overlay": [
    { content: { title: "Make it concrete", body: "Vague inputs lead to vague strategy. Pin every factor to evidence you could defend in a meeting.", imageUrl: pickRandomImage() }, script: "Make every factor concrete. Vague inputs always lead to vague strategy." },
  ],
  "image-bullets": [
    { content: { title: "Spot the pattern", bullets: ["Specific, not generic", "Backed by data", "Comparable to peers", "Tied to a decision"], imageUrl: pickRandomImage() }, script: "Good factors share four traits — specific, data-backed, comparable, and tied to a real decision." },
  ],
  "stat-image": [
    { content: { stat: "3x", statLabel: "better strategic decisions when teams use a structured framework", imageUrl: pickRandomImage() }, script: "Teams that use a structured framework make roughly three times better strategic decisions." },
  ],
  "section-image-bg": [
    { content: { title: "From insight to action", subtitle: "Where most SWOTs go to die", imageUrl: pickRandomImage() }, script: "From insight to action — this is the step where most SWOT analyses quietly die." },
  ],
  quadrant: [
    { content: {
        title: "The four boxes",
        q1Title: "Strengths", q1Body: "What we do better than anyone else.",
        q2Title: "Weaknesses", q2Body: "Where we consistently underperform.",
        q3Title: "Opportunities", q3Body: "External trends we can ride.",
        q4Title: "Threats", q4Body: "External forces that could hurt us.",
      }, script: "The four boxes — strengths, weaknesses, opportunities, threats. Two internal, two external." },
  ],
  comparison: [
    { content: {
        title: "Helpful vs Harmful",
        leftTitle: "Helpful", leftBody: "Strengths and opportunities — fuel for growth.",
        rightTitle: "Harmful", rightBody: "Weaknesses and threats — risks to manage.",
      }, script: "On one side, what helps you — strengths and opportunities. On the other, what hurts you — weaknesses and threats." },
  ],
  "definition-card": [
    { content: { term: "Opportunity Cost", body: "The value of the next-best alternative foregone when a choice is made.", caption: "Microeconomics — Mankiw, 2020" }, script: "Opportunity cost is the value of the next-best option you give up when you make a choice." },
  ],
  formula: [
    { content: { title: "Compound Interest", formula: "A = P (1 + r/n)^(nt)", body: "Where A is the future amount, P the principal, r the annual rate, n the compounding frequency, and t the time in years." }, script: "Here's the compound interest formula — A equals P times one plus r over n, raised to n times t." },
  ],
  "worked-example": [
    { content: { title: "Find the EMI for a 5-lakh loan at 12% over 3 years", bullets: ["Convert rate: r = 12% / 12 = 1% per month", "Months: n = 36", "Apply EMI formula: P × r × (1+r)^n / ((1+r)^n − 1)", "Plug in: 500000 × 0.01 × 1.4308 / 0.4308"], body: "EMI ≈ ₹16,607 per month" }, script: "Let's solve this step by step — convert the rate, plug into the EMI formula, and compute." },
  ],
  "learning-objectives": [
    { content: { title: "By the end of this lesson, you'll be able to…", bullets: ["Define key marketing terms", "Compare 4Ps and 4Cs frameworks", "Apply STP to a real product", "Critique a marketing campaign"] }, script: "By the end of this lesson, you'll be able to define the key terms, compare two major frameworks, and critique a real campaign." },
  ],
  "key-terms": [
    { content: { title: "Key Terms — Macroeconomics", bullets: ["GDP — The total monetary value of goods and services produced.", "Inflation — A sustained rise in the general price level.", "Fiscal Policy — Government use of spending and taxation.", "Monetary Policy — Central bank control of money supply and rates."] }, script: "Quick glossary — GDP, inflation, fiscal policy, and monetary policy." },
  ],
  "process-flow": [
    { content: { title: "The Strategic Planning Process", bullets: ["Analyse", "Plan", "Execute", "Review"] }, script: "Strategy is a four-step loop — analyse, plan, execute, then review and start again." },
  ],
  timeline: [
    { content: { title: "Evolution of Management Thought", bullets: ["1911 | Scientific | Taylor's time studies", "1916 | Administrative | Fayol's principles", "1930s | Human Relations | Hawthorne studies", "1960s | Systems | Holistic view of orgs", "2000s | Agile | Iterative and adaptive"] }, script: "Management theory has evolved across more than a century — from scientific to agile." },
  ],
  pyramid: [
    { content: { title: "Maslow's Hierarchy of Needs", bullets: ["Self-Actualization", "Esteem", "Belonging", "Safety", "Physiological"] }, script: "Maslow proposed five layers of human need, with physiological needs at the base." },
  ],
  cycle: [
    { content: { title: "The PDCA Cycle", body: "Continuous Improvement", bullets: ["Plan", "Do", "Check", "Act"] }, script: "PDCA — plan, do, check, act — the engine of continuous improvement." },
  ],
  "case-study": [
    { content: { title: "How Zomato turned profitable", body: "Through unit-economics discipline, premium subscriptions, and a quick-commerce bet that surprised analysts.", caption: "Case Study", bullets: ["Revenue +71%", "₹253 Cr profit", "FY24"], imageUrl: pickRandomImage() }, script: "Let's look at how Zomato finally turned the corner to profitability." },
  ],
  "question-prompt": [
    { content: { title: "Would you launch this product?", bullets: ["What does the market want?", "Can we deliver it profitably?", "How will competitors respond?"] }, script: "Pause for a moment and ask yourself — would you actually launch this product?" },
  ],
  "qa-recap": [
    { content: { title: "Quick Recap", bullets: ["What is GDP?", "The total monetary value of goods and services produced in a country in a given period.", "What's the difference between fiscal and monetary policy?", "Fiscal is government spending and taxation; monetary is central bank rate and money supply control."] }, script: "Let's recap with two quick Q-and-A pairs." },
  ],
  "pros-cons": [
    { content: { title: "Working from a Single Office", leftTitle: "Advantages", leftBody: "Faster collaboration\nStronger culture\nEasier mentoring\nClearer accountability", rightTitle: "Disadvantages", rightBody: "Limited talent pool\nCommute fatigue\nHigher real-estate cost\nLess flexibility" }, script: "There are real pros and cons to colocated work — let's look at both sides." },
  ],
  "chart-explainer": [
    { content: { title: "Quarterly Revenue Growth", chartType: "bar", chartData: [{ label: "Q1", value: 30 }, { label: "Q2", value: 55 }, { label: "Q3", value: 70 }, { label: "Q4", value: 90 }], bullets: ["Steady quarter-on-quarter growth", "Q4 driven by festive demand", "Margins improved by 4pp"] }, script: "Revenue grew steadily across all four quarters, with the festive season driving a strong Q4." },
  ],
  "citation-quote": [
    { content: { body: "The best way to predict the future is to create it.", caption: "— Peter Drucker, Management Consultant" }, script: "As Peter Drucker said — the best way to predict the future is to create it." },
  ],
};

const ALL_LAYOUTS: LayoutId[] = [
  "title", "title-body", "two-column", "bullets", "stat", "divider",
  "image-left", "image-right", "image-full", "image-grid",
  "image-bg-overlay", "image-text-overlay", "image-bullets", "stat-image", "section-image-bg",
  "quadrant", "comparison",
  "definition-card", "formula", "worked-example", "learning-objectives", "key-terms",
  "process-flow", "timeline", "pyramid", "cycle", "case-study",
  "question-prompt", "qa-recap", "pros-cons", "chart-explainer", "citation-quote",
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
