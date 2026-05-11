import { useNavigate } from "react-router-dom";
import { Topbar } from "@/components/app-shell/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TEMPLATES } from "@/lib/data/seedTemplates";
import { useProjects } from "@/lib/data/useProjects";
import { ArrowRight } from "lucide-react";

export default function TemplatesPage() {
  const navigate = useNavigate();
  const create = useProjects((s) => s.createProject);

  const useTemplate = (id: string) => {
    const tpl = TEMPLATES.find((t) => t.id === id);
    if (!tpl) return;
    const project = create({
      title: tpl.name,
      themeId: tpl.themeId,
      voice: tpl.voice,
      voiceMode: "ai",
      source: tpl.source,
      templateId: tpl.id,
      slides: [],
    });
    navigate(`/app/generating?id=${project.id}`);
  };

  const categories = Array.from(new Set(TEMPLATES.map((t) => t.category)));

  return (
    <>
      <Topbar eyebrow="Templates" title="Start with a structure" />
      <div className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto px-6 py-8 space-y-10">
          {categories.map((cat) => (
            <section key={cat}>
              <h2 className="font-display text-xl mb-4">{cat}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {TEMPLATES.filter((t) => t.category === cat).map((t) => (
                  <Card key={t.id} className="p-5 group hover:shadow-premium hover:-translate-y-0.5 transition-all flex flex-col">
                    <div className="aspect-[16/9] -mx-5 -mt-5 mb-4 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center p-4">
                      <div className="font-display text-lg text-primary/80 text-center line-clamp-3">{t.name}</div>
                    </div>
                    <div className="font-medium">{t.name}</div>
                    <p className="text-xs text-muted-foreground mt-1 mb-4 flex-1">{t.description}</p>
                    <Button variant="outline" size="sm" className="self-start" onClick={() => useTemplate(t.id)}>
                      Use template <ArrowRight className="h-3 w-3" />
                    </Button>
                  </Card>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
