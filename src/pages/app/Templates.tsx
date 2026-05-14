import { useNavigate } from "react-router-dom";
import { Topbar } from "@/components/app-shell/AppShell";
import { Button } from "@/components/ui/button";
import { TEMPLATES } from "@/lib/data/seedTemplates";
import { THEMES } from "@/lib/prototype/themes";
import { EditorialHeader } from "@/components/editorial/EditorialHeader";
import { ArrowRight } from "lucide-react";

export default function TemplatesPage() {
  const navigate = useNavigate();

  const useTemplate = (id: string) => {
    navigate(`/app/new?template=${id}`);
  };

  const categories = Array.from(new Set(TEMPLATES.map((t) => t.category)));

  return (
    <>
      <Topbar crumbs={[{ label: "Templates" }]} />
      <div className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto px-8 lg:px-12 py-12 lg:py-16">
          <EditorialHeader
            eyebrow={
              <>
                <span className="h-px w-6 bg-foreground/30 inline-block" />
                <span>Templates · {TEMPLATES.length} starters</span>
              </>
            }
            title="Start with a structure."
            lede="Tested arcs for the talks you keep giving — pitches, recaps, intros, updates."
          />

          <div className="mt-14 space-y-16">
            {categories.map((cat, idx) => {
              const items = TEMPLATES.filter((t) => t.category === cat);
              return (
                <section key={cat} className="grid grid-cols-12 gap-6">
                  {/* Side gutter — editorial table-of-contents number */}
                  <div className="col-span-12 md:col-span-3 lg:col-span-2">
                    <div className="md:sticky md:top-20">
                      <div className="font-serif tnum text-5xl text-ink leading-none">
                        {String(idx + 1).padStart(2, "0")}
                      </div>
                      <div className="font-serif italic text-base text-foreground/70 mt-2">
                        {cat}
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-1 tnum">
                        {items.length} {items.length === 1 ? "template" : "templates"}
                      </div>
                      <div className="h-px w-10 bg-foreground/30 mt-3" />
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-9 lg:col-span-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {items.map((t) => {
                        const theme = THEMES[t.themeId] ?? THEMES.studio;
                        return (
                          <article
                            key={t.id}
                            className="group bg-card border hairline shadow-paper hover:shadow-paper-hover transition-shadow flex flex-col"
                          >
                            {/* Themed preview rendered from theme tokens, not gradient slop */}
                            <div
                              className="relative aspect-video overflow-hidden"
                              style={{ background: theme.bg }}
                            >
                              <div
                                className="absolute inset-0 px-[7%] py-[8%] flex flex-col justify-between"
                                style={{ color: theme.text }}
                              >
                                <div
                                  className="text-[9px] uppercase opacity-60"
                                  style={{ letterSpacing: "0.22em", fontFamily: theme.fontBody }}
                                >
                                  {t.category}
                                </div>
                                <div>
                                  <div
                                    style={{
                                      fontFamily: theme.fontHead,
                                      fontSize: "clamp(16px, 4cqw, 26px)",
                                      lineHeight: 1.05,
                                      letterSpacing: "-0.02em",
                                      fontWeight: 600,
                                    }}
                                  >
                                    {t.name}
                                  </div>
                                  <div
                                    className="mt-2 h-[2px] w-8"
                                    style={{ background: theme.accent }}
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="p-5 flex-1 flex flex-col">
                              <div className="flex items-baseline justify-between gap-2">
                                <div className="font-medium text-[15px] text-ink">{t.name}</div>
                                <div className="text-[11px] text-muted-foreground">
                                  <span
                                    className="inline-block h-1.5 w-1.5 rounded-full mr-1.5 align-middle"
                                    style={{ background: theme.accent }}
                                  />
                                  {theme.name}
                                </div>
                              </div>
                              <p className="text-[13px] text-muted-foreground mt-1.5 flex-1">
                                {t.description}
                              </p>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="self-start mt-4 -ml-2 text-primary hover:text-primary"
                                onClick={() => useTemplate(t.id)}
                              >
                                Use template
                                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                              </Button>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
