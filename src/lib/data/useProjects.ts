import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Project } from "./types";
import type { Slide, ThemeId } from "@/lib/prototype/types";
import { logHistory } from "./useHistory";

interface ProjectsState {
  projects: Project[];
  createProject: (init: Partial<Project> & { title: string }) => Project;
  updateProject: (id: string, patch: Partial<Project>) => void;
  saveSlides: (id: string, slides: Slide[], themeId?: ThemeId) => void;
  renameProject: (id: string, title: string) => void;
  duplicateProject: (id: string) => Project | null;
  deleteProject: (id: string) => void;
  getProject: (id: string) => Project | undefined;
}

export const useProjects = create<ProjectsState>()(
  persist(
    (set, get) => ({
      projects: [],
      createProject: (init) => {
        const now = Date.now();
        const project: Project = {
          id: `p-${now}-${Math.random().toString(36).slice(2, 7)}`,
          title: init.title || "Untitled video",
          createdAt: now,
          updatedAt: now,
          themeId: init.themeId ?? "studio",
          voice: init.voice ?? "Aurora",
          voiceMode: init.voiceMode ?? "ai",
          slides: init.slides ?? [],
          source: init.source,
          templateId: init.templateId,
        };
        set((s) => ({ projects: [project, ...s.projects] }));
        logHistory({
          type: "project.created",
          projectId: project.id,
          projectTitle: project.title,
          label: `Created “${project.title}”`,
        });
        return project;
      },
      updateProject: (id, patch) =>
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === id ? { ...p, ...patch, updatedAt: Date.now() } : p,
          ),
        })),
      saveSlides: (id, slides, themeId) =>
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === id
              ? { ...p, slides, themeId: themeId ?? p.themeId, updatedAt: Date.now() }
              : p,
          ),
        })),
      renameProject: (id, title) => {
        const prev = get().projects.find((p) => p.id === id);
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === id ? { ...p, title, updatedAt: Date.now() } : p,
          ),
        }));
        if (prev && prev.title !== title) {
          logHistory({
            type: "project.renamed",
            projectId: id,
            projectTitle: title,
            label: `Renamed to “${title}”`,
          });
        }
      },
      duplicateProject: (id) => {
        const orig = get().projects.find((p) => p.id === id);
        if (!orig) return null;
        const now = Date.now();
        const copy: Project = {
          ...orig,
          id: `p-${now}-${Math.random().toString(36).slice(2, 7)}`,
          title: `${orig.title} (copy)`,
          createdAt: now,
          updatedAt: now,
          slides: orig.slides.map((s) => ({ ...s, content: { ...s.content } })),
        };
        set((s) => ({ projects: [copy, ...s.projects] }));
        logHistory({
          type: "project.duplicated",
          projectId: copy.id,
          projectTitle: copy.title,
          label: `Duplicated “${orig.title}”`,
        });
        return copy;
      },
      deleteProject: (id) => {
        const prev = get().projects.find((p) => p.id === id);
        set((s) => ({ projects: s.projects.filter((p) => p.id !== id) }));
        if (prev) {
          logHistory({
            type: "project.deleted",
            projectId: id,
            projectTitle: prev.title,
            label: `Deleted “${prev.title}”`,
          });
        }
      },
      getProject: (id) => get().projects.find((p) => p.id === id),
    }),
    { name: "cs.projects" },
  ),
);
