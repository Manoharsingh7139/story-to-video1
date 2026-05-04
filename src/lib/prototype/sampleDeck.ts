import type { Slide } from "./types";

export const SAMPLE_TEXT = `The shift to remote work has fundamentally changed how teams collaborate. Companies that embrace asynchronous communication report 30% higher productivity and significantly better employee retention. But getting there requires intentional changes to processes, tools, and culture.

The biggest pitfall is treating remote like in-office work over Zoom. Real async means writing things down, trusting people to manage their own time, and measuring outputs instead of hours. Teams that nail this become magnets for top talent worldwide.

Three principles drive success: write more than you talk, default to public over private, and respect everyone's deep work time. Get these right and your team will outperform colocated competitors.`;

export const SAMPLE_DECK: Slide[] = [
  {
    id: "s1",
    layout: "title",
    content: {
      title: "The Async Advantage",
      subtitle: "How modern teams outperform with remote-first work",
    },
    script:
      "The way we work has changed forever. Today we'll explore why async-first teams are pulling ahead — and what it takes to build one.",
  },
  {
    id: "s2",
    layout: "stat",
    content: {
      stat: "30%",
      statLabel: "higher productivity in async-first teams",
    },
    script:
      "Companies that fully embrace asynchronous communication report a thirty percent jump in productivity. That's not a small optimization — it's a structural advantage.",
  },
  {
    id: "s3",
    layout: "title-body",
    content: {
      title: "Why it matters",
      body: "Remote work isn't just a perk anymore. It's the operating system of the most resilient companies in the world. Those who treat it as a real discipline win on talent, output, and retention.",
    },
    script:
      "Why should you care? Because remote-first isn't a perk anymore. It's the operating system of the most resilient companies in the world.",
  },
  {
    id: "s4",
    layout: "bullets",
    content: {
      title: "Three principles that work",
      bullets: [
        "Write more than you talk",
        "Default to public over private",
        "Respect deep work time",
      ],
    },
    script:
      "Three principles separate the winners from the also-rans. Write more than you talk. Default to public over private. And fiercely protect deep work time.",
  },
  {
    id: "s5",
    layout: "two-column",
    content: {
      leftTitle: "The trap",
      leftBody:
        "Treating remote like in-office work over Zoom. Endless meetings, real-time pressure, and surveillance disguised as collaboration.",
      rightTitle: "The shift",
      rightBody:
        "Write things down. Trust people to manage their time. Measure outcomes, not hours. Build a culture where thinking has space to happen.",
    },
    script:
      "Most teams fall into the same trap — they just move office habits onto Zoom. The shift that actually works is deeper. It's about what you measure and what you value.",
  },
  {
    id: "s6",
    layout: "divider",
    content: {
      title: "Putting it into practice",
      subtitle: "What to do on Monday morning",
    },
    script:
      "Enough theory. Let's talk about what to actually change next week.",
  },
  {
    id: "s7",
    layout: "bullets",
    content: {
      title: "Start here",
      bullets: [
        "Cancel one recurring meeting this week",
        "Move a decision into a written doc",
        "Block four hours of no-meeting time",
        "Make one Slack channel public",
      ],
    },
    script:
      "Start small. Cancel one meeting. Move one decision to a doc. Block four hours of focus time. Open up one private channel. That's it for week one.",
  },
  {
    id: "s8",
    layout: "title",
    content: {
      title: "The teams who get this right win.",
      subtitle: "Be one of them.",
    },
    script:
      "The teams who get this right become magnets for the best talent in the world. Be one of them. Thanks for watching.",
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
