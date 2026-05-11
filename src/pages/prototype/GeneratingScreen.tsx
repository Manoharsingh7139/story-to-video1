import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { usePrototypeStore } from "@/lib/prototype/store";
import { useProjects } from "@/lib/data/useProjects";
import { SAMPLE_DECK } from "@/lib/prototype/sampleDeck";
import { Check } from "lucide-react";
import { Wordmark } from "@/components/Wordmark";

const STEPS = [
  "Reading your text…",
  "Outlining slides…",
  "Drafting slide content…",
  "Writing voiceover scripts…",
  "Applying your theme…",
];

export default function GeneratingScreen() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const projectId = params.get("id");
  const saveSlides = useProjects((s) => s.saveSlides);
  const getProject = useProjects((s) => s.getProject);
  const loadSampleDeck = usePrototypeStore((s) => s.loadSampleDeck);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const totalMs = 3500;
    const perStep = totalMs / STEPS.length;
    const interval = setInterval(() => {
      setStep((s) => Math.min(s + 1, STEPS.length - 1));
    }, perStep);

    const done = setTimeout(() => {
      clearInterval(interval);
      const slides = SAMPLE_DECK.map((s) => ({ ...s, content: { ...s.content } }));
      if (projectId && getProject(projectId)) {
        saveSlides(projectId, slides);
        loadSampleDeck();
        navigate(`/app/editor/${projectId}`, { replace: true });
      } else {
        loadSampleDeck();
        navigate("/app", { replace: true });
      }
    }, totalMs + 400);

    return () => {
      clearInterval(interval);
      clearTimeout(done);
    };
  }, [loadSampleDeck, navigate, projectId, saveSlides, getProject]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-8">
      <div className="max-w-md w-full">
        <div className="flex items-center justify-center mb-10">
          <div className="relative flex flex-col items-center gap-5">
            <div className="relative">
              <Wordmark size="lg" iconOnly />
              <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-primary animate-pulse-glow" />
            </div>
            <Wordmark size="md" />
          </div>
        </div>
        <h1 className="font-display text-3xl text-center mb-2 tracking-[-0.02em]">Composing your presentation</h1>
        <p className="text-muted-foreground text-center mb-10 text-sm">A few seconds of quiet, then yours.</p>

        <ul className="space-y-3">
          {STEPS.map((label, i) => {
            const done = i < step;
            const current = i === step;
            return (
              <li key={label} className="flex items-center gap-3">
                <div
                  className={`h-5 w-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 transition-colors ${
                    done ? "bg-primary text-primary-foreground" : current ? "bg-primary/10" : "bg-muted/60"
                  }`}
                >
                  {done ? (
                    <Check className="h-3 w-3" strokeWidth={3} />
                  ) : current ? (
                    <span className="h-2 w-2 rounded-full bg-primary animate-pulse-glow" />
                  ) : null}
                </div>
                <span className={`text-sm ${i <= step ? "text-foreground" : "text-muted-foreground"}`}>{label}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
