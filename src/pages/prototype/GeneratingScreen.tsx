import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePrototypeStore } from "@/lib/prototype/store";
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
      loadSampleDeck();
      navigate("/editor");
    }, totalMs + 400);

    return () => {
      clearInterval(interval);
      clearTimeout(done);
    };
  }, [loadSampleDeck, navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-8">
      <div className="max-w-md w-full">
        <div className="flex items-center justify-center mb-10">
          <div className="h-14 w-14 rounded-2xl bg-foreground flex items-center justify-center animate-pulse">
            <Sparkles className="h-7 w-7 text-background" />
          </div>
        </div>
        <h1 className="text-2xl font-semibold text-center mb-2 tracking-tight">Generating your presentation</h1>
        <p className="text-muted-foreground text-center mb-10 text-sm">This usually takes a few seconds.</p>

        <ul className="space-y-3">
          {STEPS.map((label, i) => (
            <li key={label} className="flex items-center gap-3">
              <div
                className={`h-5 w-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${
                  i < step ? "bg-foreground text-background" : i === step ? "bg-muted" : "bg-muted/40"
                }`}
              >
                {i < step ? <Check className="h-3 w-3" /> : i === step ? <span className="h-2 w-2 rounded-full bg-foreground animate-pulse" /> : null}
              </div>
              <span className={`text-sm ${i <= step ? "text-foreground" : "text-muted-foreground"}`}>{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
