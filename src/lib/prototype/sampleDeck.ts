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
];

export const VOICES = [
  "Sarah — warm female",
  "James — professional male",
  "Aria — bright female",
  "Marcus — deep male",
  "Lily — young female",
  "Ethan — calm male",
  "Nora — neutral female",
  "Owen — narrator male",
  "Zoe — energetic female",
  "Felix — friendly male",
];
