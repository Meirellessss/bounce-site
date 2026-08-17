import { createClient } from "@/lib/supabase/server";
import { ProjectsCarousel } from "./ProjectsCarousel";
import type { Project } from "@/lib/types";
import { ShowcaseIntro } from "./ShowcaseIntro";

export const revalidate = 60;

async function getProjects(): Promise<Project[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data ?? []) as Project[];
  } catch {
    return [];
  }
}

export async function Showcase() {
  const projects = await getProjects();

  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden bg-ink-950 pt-24 pb-16 md:pt-32 md:pb-24 flex flex-col">
      {/* Background: logo horizontal da Bounce */}
      <div className="absolute inset-0 -z-10">
        <img
          src="/brand/bounce-hero.svg"
          alt=""
          className="w-full h-full object-cover object-center opacity-40 md:opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950/70 via-ink-950/85 to-ink-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_120%,rgba(200,255,77,0.18),transparent_60%)]" />
      </div>

      <div className="absolute inset-0 -z-10 bg-noise" />

      <ShowcaseIntro count={projects.length} />

      <div className="relative mx-auto max-w-6xl px-0 md:px-5 w-full mt-8 md:mt-12">
        <ProjectsCarousel projects={projects} />
      </div>
    </section>
  );
}
