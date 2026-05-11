import type { ThemeId } from "@/lib/prototype/types";

export interface TemplateSeed {
  id: string;
  name: string;
  category: "Pitch" | "Education" | "Marketing" | "Internal";
  description: string;
  themeId: ThemeId;
  source: string;
  voice: string;
}

export const TEMPLATES: TemplateSeed[] = [
  {
    id: "tpl-pitch",
    name: "Investor pitch",
    category: "Pitch",
    description: "Problem, solution, market, traction, ask.",
    themeId: "studio",
    voice: "Aurora",
    source: "Our company is solving a critical problem in the modern workplace. The market opportunity is significant, and our early traction proves demand. We're raising to scale go-to-market.",
  },
  {
    id: "tpl-course",
    name: "Course intro",
    category: "Education",
    description: "Welcome learners and frame the journey ahead.",
    themeId: "editorial",
    voice: "Sage",
    source: "Welcome to this course. Over the next sessions, we'll cover foundational concepts, work through examples, and build practical skills you can apply right away.",
  },
  {
    id: "tpl-launch",
    name: "Product launch",
    category: "Marketing",
    description: "Tease, reveal, demo, and call to action.",
    themeId: "studio",
    voice: "Atlas",
    source: "Today we're launching something we've been quietly building for months. It changes how teams collaborate on creative work. Here's what it does and why it matters.",
  },
  {
    id: "tpl-recap",
    name: "Weekly recap",
    category: "Internal",
    description: "Wins, blockers, what's next.",
    themeId: "studio",
    voice: "Iris",
    source: "Here's a quick recap of the week. We shipped three features, learned from one experiment, and are heading into next week with clear priorities.",
  },
  {
    id: "tpl-tutorial",
    name: "How-to tutorial",
    category: "Education",
    description: "Step-by-step walkthrough with visuals.",
    themeId: "editorial",
    voice: "Sage",
    source: "In this tutorial you'll learn how to set up your account, configure preferences, and complete your first project from start to finish.",
  },
  {
    id: "tpl-case",
    name: "Case study",
    category: "Marketing",
    description: "Customer story: challenge, approach, outcome.",
    themeId: "studio",
    voice: "Aurora",
    source: "Meet a customer who transformed their workflow with our product. They faced a tough challenge, took a measured approach, and saw measurable outcomes within weeks.",
  },
  {
    id: "tpl-onboarding",
    name: "New hire onboarding",
    category: "Internal",
    description: "Welcome new teammates with culture and tools.",
    themeId: "midnight",
    voice: "Atlas",
    source: "Welcome to the team. Here's an overview of our mission, how we work, the tools we use day to day, and where to find help when you need it.",
  },
  {
    id: "tpl-update",
    name: "Founder update",
    category: "Pitch",
    description: "Monthly progress letter to investors.",
    themeId: "editorial",
    voice: "Iris",
    source: "Here's our monthly update. We grew, we learned, we made hard calls. Here's what changed, what we shipped, and where we're focusing next.",
  },
];
