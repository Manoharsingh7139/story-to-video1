import type { Slide } from "./types";
import { STOCK_IMAGES } from "./stockImages";

export const SAMPLE_TEXT = `SWOT Analysis is a structured strategic planning tool used to evaluate Strengths, Weaknesses, Opportunities, and Threats. Strengths and Weaknesses are internal — things you control. Opportunities and Threats are external — forces you can anticipate but not control.

The framework works across business strategy, product development, career planning, and decision-making. Done well, it forces honest, evidence-based thinking. Done poorly, it produces vague lists nobody acts on.

The five steps are: define the objective, gather data, list factors that are specific and evidence-based, prioritize by impact, and convert the analysis into action using SO, WO, ST, and WT strategies.

The real value of a SWOT isn't the matrix itself. It's the decisions that come out of it. A weak SWOT with strong execution beats a perfect SWOT with no action.`;

export const SAMPLE_DECK: Slide[] = [
  {
    id: "s1",
    layout: "title",
    content: {
      title: "SWOT Analysis",
      subtitle: "A practical guide to strategic thinking",
    },
    script:
      "Let's talk about SWOT — a deceptively simple framework that, used well, sharpens almost any strategic decision.",
  },
  {
    id: "s2",
    layout: "image-bg-overlay",
    content: {
      title: "What is SWOT?",
      body: "A structured tool to evaluate Strengths, Weaknesses, Opportunities, and Threats — across business, product, and career decisions.",
      imageUrl: STOCK_IMAGES[5].url,
      style: { overlayTint: "dark", overlayStrength: "strong" },
    },
    script:
      "SWOT is a structured tool for evaluating four things — strengths, weaknesses, opportunities, and threats. It works for businesses, products, and even career decisions.",
  },
  {
    id: "s3",
    layout: "quadrant",
    content: {
      title: "The four boxes — internal vs external",
      style: { quadrantPalette: "swot" },
      q1Title: "Strengths",
      q1Body: "Internal advantages — strong brand, skilled team, proprietary tech, customer loyalty.",
      q2Title: "Weaknesses",
      q2Body: "Internal limitations — limited capital, weak distribution, skill gaps, poor brand presence.",
      q3Title: "Opportunities",
      q3Body: "External tailwinds — market expansion, new tech, regulatory shifts, competitor weaknesses.",
      q4Title: "Threats",
      q4Body: "External risks — new entrants, regulation changes, downturns, substitute products.",
    },
    script:
      "Picture a 2 by 2. The top row is internal — things you control. The bottom row is external — things you can only anticipate. Strengths and weaknesses live inside. Opportunities and threats live outside.",
  },
  {
    id: "s4",
    layout: "image-text-overlay",
    content: {
      title: "Strengths",
      body: "Positive internal attributes that give you an edge. Key test: what do we do better than anyone else?",
      imageUrl: STOCK_IMAGES[9].url,
      style: { textCardSide: "left" },
    },
    script:
      "Strengths are the positive internal attributes that give you an edge. The test is simple — what do you do better than anyone else?",
  },
  {
    id: "s5",
    layout: "image-bullets",
    content: {
      title: "Weaknesses — where you underperform",
      bullets: [
        "Limited capital",
        "Poor distribution network",
        "Weak brand presence",
        "Skill gaps in key areas",
      ],
      imageUrl: STOCK_IMAGES[3].url,
      style: { imageSide: "left", bulletVariant: "checklist" },
    },
    script:
      "Weaknesses are the internal factors holding you back. Be honest. Ask where you're consistently underperforming compared to peers.",
  },
  {
    id: "s6",
    layout: "image-right",
    content: {
      title: "Opportunities",
      body: "External conditions you can ride for growth — market expansion, emerging technology, regulatory shifts, even competitor missteps. The test: what trends can we exploit?",
      imageUrl: STOCK_IMAGES[7].url,
    },
    script:
      "Opportunities are the external conditions you can ride. New markets, new tech, new regulation, or even a competitor stumbling. Ask what trends you can exploit.",
  },
  {
    id: "s7",
    layout: "image-bullets",
    content: {
      title: "Threats — what could disrupt you",
      bullets: [
        "New competitors entering",
        "Changing regulations",
        "Economic downturn",
        "Substitute products",
      ],
      imageUrl: STOCK_IMAGES[1].url,
      style: { imageSide: "right", bulletVariant: "cards" },
    },
    script:
      "Threats are the external forces that can disrupt you. New competitors, regulation, downturns, substitutes. The test — what external forces could hurt us?",
  },
  {
    id: "s8",
    layout: "comparison",
    content: {
      title: "Helpful vs Harmful",
      leftTitle: "Helpful",
      leftBody: "Strengths (internal) and Opportunities (external) — the engines of growth. Lean into them deliberately.",
      rightTitle: "Harmful",
      rightBody: "Weaknesses (internal) and Threats (external) — the risks to manage. Plan around them, don't ignore them.",
    },
    script:
      "Step back and you'll see two halves of the same story. Strengths and opportunities are helpful. Weaknesses and threats are harmful. Both deserve real attention.",
  },
  {
    id: "s9",
    layout: "section-image-bg",
    content: {
      title: "How to conduct a SWOT",
      subtitle: "Five steps from blank page to strategy",
      imageUrl: STOCK_IMAGES[10].url,
      style: { overlayTint: "accent", overlayStrength: "strong" },
    },
    script:
      "So how do you actually do one? Five steps — from blank page to a strategy you can act on.",
  },
  {
    id: "s10",
    layout: "bullets",
    content: {
      title: "The five steps",
      style: { bulletVariant: "numbered" },
      bullets: [
        "Define the objective — business, product, project, or career",
        "Gather data from reports, research, and customer feedback",
        "List factors that are specific and evidence-based",
        "Prioritize by impact, urgency, and how much you control",
        "Convert analysis into action with SO, WO, ST, WT strategies",
      ],
    },
    script:
      "Define what you're analyzing. Gather real data. List specific, evidence-backed factors. Prioritize them. Then turn the analysis into action.",
  },
  {
    id: "s11",
    layout: "quadrant",
    content: {
      title: "Strategy combinations — turn the matrix into moves",
      style: { quadrantPalette: "accent" },
      q1Title: "SO — attack",
      q1Body: "Use strengths to capture opportunities. Strong tech team plus AI trend equals build an AI product.",
      q2Title: "WO — fix",
      q2Body: "Address weaknesses to unlock opportunities. Weak distribution plus growing demand equals build partnerships.",
      q3Title: "ST — defend",
      q3Body: "Use strengths to blunt threats. Strong brand plus new competitors equals invest in brand spend.",
      q4Title: "WT — survive",
      q4Body: "Minimize weaknesses against threats. Thin margins plus a price war equals aggressive cost optimization.",
    },
    script:
      "Pair the boxes and you get four real strategies. SO is attack. WO is fix. ST is defend. WT is survive. Each one is a concrete move, not a list.",
  },
  {
    id: "s12",
    layout: "stat-image",
    content: {
      stat: "3x",
      statLabel: "better strategic alignment when SWOT is tied to specific actions, not just analysis",
      imageUrl: STOCK_IMAGES[6].url,
      style: { imageSide: "right", statSize: "display", statDecoration: "gradient" },
    },
    script:
      "Teams that link their SWOT to specific actions report roughly three times better strategic alignment than those who treat it as an exercise.",
  },
  {
    id: "s13",
    layout: "two-column",
    content: {
      leftTitle: "Advantages",
      leftBody: "Simple and structured. Works across domains. Encourages holistic thinking. Helps with strategic alignment.",
      rightTitle: "Limitations",
      rightBody: "Inputs can be subjective. It's a static snapshot. Becomes generic if poorly executed. Doesn't provide direct solutions.",
    },
    script:
      "SWOT has clear advantages — it's simple, structured, and works almost anywhere. But it's also subjective, static, and easy to do badly. Know both sides.",
  },
  {
    id: "s14",
    layout: "image-full",
    content: {
      title: "SWOT is not the output.",
      subtitle: "The value lies in the decisions you make from it.",
      imageUrl: STOCK_IMAGES[6].url,
    },
    script:
      "Remember — the matrix isn't the point. The decisions you make from it are. A weak SWOT with strong execution beats a perfect SWOT with none.",
  },
  {
    id: "s15",
    layout: "learning-objectives",
    content: {
      title: "By the end of this lesson, you will be able to…",
      bullets: [
        "Define SWOT and its four components",
        "Distinguish internal vs external factors",
        "Build SO, WO, ST, and WT strategies",
        "Critique a real SWOT analysis",
      ],
    },
    script: "By the end of this lesson, you'll be able to define SWOT, distinguish internal from external factors, build all four strategy combinations, and critically evaluate a real example.",
  },
  {
    id: "s16",
    layout: "definition-card",
    content: {
      term: "SWOT",
      body: "An acronym for Strengths, Weaknesses, Opportunities, and Threats — a structured framework for evaluating strategic position across internal capabilities and external conditions.",
      caption: "Source: Andrews, Business Policy (1971)",
    },
    script: "SWOT stands for Strengths, Weaknesses, Opportunities, and Threats — first formalized as a strategy tool in the 1970s.",
  },
  {
    id: "s17",
    layout: "process-flow",
    content: {
      title: "How a SWOT comes together",
      bullets: ["Define", "Gather", "List", "Prioritize", "Act"],
    },
    script: "A real SWOT moves through five stages — define the question, gather evidence, list factors, prioritize them, and act.",
  },
  {
    id: "s18",
    layout: "timeline",
    content: {
      title: "Evolution of strategic thought",
      bullets: [
        "1960s | SWOT | Andrews & Harvard",
        "1980 | Five Forces | Porter",
        "1990 | Core Competence | Hamel & Prahalad",
        "2005 | Blue Ocean | Kim & Mauborgne",
        "2010s | Lean Strategy | Ries",
      ],
    },
    script: "Strategic thinking has evolved across decades — SWOT in the sixties, Porter's Five Forces in the eighties, then core competence, blue ocean, and lean strategy.",
  },
  {
    id: "s19",
    layout: "pyramid",
    content: {
      title: "Maslow's Hierarchy of Needs",
      bullets: ["Self-Actualization", "Esteem", "Belonging", "Safety", "Physiological"],
    },
    script: "A classic example of hierarchical thinking — Maslow's five layers of human need, with physiological needs forming the base.",
  },
  {
    id: "s20",
    layout: "cycle",
    content: {
      title: "PDCA — The improvement cycle",
      body: "Continuous Improvement",
      bullets: ["Plan", "Do", "Check", "Act"],
    },
    script: "Continuous improvement runs on a four-step loop — plan, do, check, act — and then start again.",
  },
  {
    id: "s21",
    layout: "formula",
    content: {
      title: "Compound Interest",
      formula: "A = P (1 + r/n)^(nt)",
      body: "A is the future amount, P is the principal, r the annual rate, n the compounding frequency, t the time in years.",
    },
    script: "Compound interest — A equals P times one plus r over n, all raised to n times t.",
  },
  {
    id: "s22",
    layout: "worked-example",
    content: {
      title: "Find the EMI on a ₹5,00,000 loan at 12% over 3 years",
      bullets: [
        "Monthly rate r = 12% / 12 = 1% = 0.01",
        "Number of months n = 36",
        "EMI formula: P × r × (1+r)^n / ((1+r)^n − 1)",
        "Plug in: 500000 × 0.01 × 1.4308 / 0.4308",
      ],
      body: "EMI ≈ ₹16,607 per month",
    },
    script: "Let's solve it step by step — convert the rate, plug into the EMI formula, and compute.",
  },
  {
    id: "s23",
    layout: "key-terms",
    content: {
      title: "Key Terms — Strategy",
      bullets: [
        "Strategy — A plan to achieve long-term goals under uncertainty.",
        "Tactics — Short-term actions that execute a strategy.",
        "Vision — A picture of the desired future state.",
        "Mission — Why an organisation exists today.",
        "KPI — A measurable indicator of progress.",
        "OKR — Objectives paired with key results.",
      ],
    },
    script: "A quick glossary — strategy, tactics, vision, mission, KPI, and OKR. The vocabulary you'll use through the course.",
  },
  {
    id: "s24",
    layout: "case-study",
    content: {
      title: "How Zomato turned profitable",
      caption: "Case Study",
      body: "Through unit-economics discipline, premium subscriptions, and a quick-commerce bet that surprised analysts. By FY24, the company posted its first full year of profit.",
      bullets: ["Revenue +71%", "₹253 Cr profit", "FY24"],
      imageUrl: STOCK_IMAGES[8].url,
    },
    script: "Let's look at how Zomato finally turned the corner — a case in unit economics, subscriptions, and a well-timed bet on quick commerce.",
  },
  {
    id: "s25",
    layout: "chart-explainer",
    content: {
      title: "Quarterly revenue growth",
      chartType: "bar",
      chartData: [
        { label: "Q1", value: 30 },
        { label: "Q2", value: 55 },
        { label: "Q3", value: 70 },
        { label: "Q4", value: 90 },
      ],
      bullets: [
        "Steady quarter-on-quarter growth",
        "Q4 driven by festive demand",
        "Margins improved by 4 percentage points",
      ],
    },
    script: "Revenue grew steadily across all four quarters, with the festive season driving a strong Q4.",
  },
  {
    id: "s26",
    layout: "pros-cons",
    content: {
      title: "Working from a single office",
      leftTitle: "Advantages",
      rightTitle: "Disadvantages",
      leftBody: "Faster collaboration\nStronger culture\nEasier mentoring\nClearer accountability",
      rightBody: "Limited talent pool\nCommute fatigue\nHigher real-estate cost\nLess flexibility",
    },
    script: "There are real pros and cons to colocated work — let's look at both sides honestly.",
  },
  {
    id: "s27",
    layout: "question-prompt",
    content: {
      title: "Would you launch this product?",
      bullets: [
        "What does the market actually want?",
        "Can we deliver it profitably?",
        "How will competitors respond?",
      ],
    },
    script: "Pause for a moment. With everything you've learned — would you actually launch this product?",
  },
  {
    id: "s28",
    layout: "qa-recap",
    content: {
      title: "Quick recap",
      bullets: [
        "What does SWOT stand for?",
        "Strengths, Weaknesses, Opportunities, and Threats.",
        "Which of the four are internal?",
        "Strengths and Weaknesses — things you control.",
      ],
    },
    script: "A quick recap — what SWOT stands for, and which two of the four are internal.",
  },
  {
    id: "s29",
    layout: "citation-quote",
    content: {
      body: "The best way to predict the future is to create it.",
      caption: "— Peter Drucker, Management Consultant",
    },
    script: "As Peter Drucker put it — the best way to predict the future is to create it.",
  },
];

export const VOICES = [
  "Aanya — Indian female, warm tone",
  "Arjun — Indian male, soft tone",
  "Priya — Indian female, bright tone",
  "Rohan — Indian male, professional tone",
  "Meera — Indian female, calm tone",
  "Vikram — Indian male, deep narrator tone",
  "Diya — Indian female, energetic tone",
  "Kabir — Indian male, friendly tone",
  "Isha — Indian female, neutral tone",
  "Aditya — Indian male, authoritative tone",
];
