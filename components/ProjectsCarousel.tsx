"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import clsx from "clsx";
import type { Project } from "@/lib/types";

type Props = { projects: Project[] };

export function ProjectsCarousel({ projects }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
    dragFree: true,
    containScroll: "trimSnaps",
    skipSnaps: false,
  });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [progress, setProgress] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
    setProgress(Math.max(0, Math.min(1, emblaApi.scrollProgress())));
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("scroll", onSelect);
  }, [emblaApi, onSelect]);

  if (!projects.length) {
    return (
      <div className="rounded-3xl border border-dashed border-white/10 p-12 text-center text-bone-200/60">
        Nenhum projeto cadastrado ainda.
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="embla -mx-5 md:-mx-0" ref={emblaRef}>
        <div className="embla__container gap-4 md:gap-6 px-5 md:px-0">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
          {/* End spacer so last card can align nicely */}
          <div className="shrink-0 w-2 md:w-8" aria-hidden />
        </div>
      </div>

      {/* Controls */}
      <div className="mt-8 flex items-center gap-4 px-5 md:px-0">
        <div className="flex gap-2">
          <button
            onClick={() => emblaApi?.scrollPrev()}
            disabled={!canPrev}
            aria-label="Anterior"
            className={clsx(
              "h-11 w-11 rounded-full border transition-all inline-flex items-center justify-center",
              canPrev
                ? "border-white/20 text-bone-50 hover:border-lime-400 hover:text-lime-400"
                : "border-white/10 text-bone-200/30 cursor-not-allowed"
            )}
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => emblaApi?.scrollNext()}
            disabled={!canNext}
            aria-label="Próximo"
            className={clsx(
              "h-11 w-11 rounded-full border transition-all inline-flex items-center justify-center",
              canNext
                ? "border-white/20 text-bone-50 hover:border-lime-400 hover:text-lime-400"
                : "border-white/10 text-bone-200/30 cursor-not-allowed"
            )}
          >
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 h-px bg-white/10 relative overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-lime-400 transition-[width] duration-200"
            style={{ width: `${Math.max(8, progress * 100)}%` }}
          />
        </div>
        <span className="text-xs text-bone-200/60 uppercase tracking-widest tabular-nums">
          arraste →
        </span>
      </div>
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const host = safeHost(project.url);
  return (
    <article className="embla__slide w-[85vw] sm:w-[60vw] md:w-[46vw] lg:w-[36vw] xl:w-[32rem]">
      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group block rounded-3xl overflow-hidden border border-white/10 bg-ink-800 hover:border-lime-400/50 transition-all"
      >
        <div className="relative aspect-[16/11] overflow-hidden bg-ink-900">
          {project.screenshot_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.screenshot_url}
              alt={project.name}
              className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03] select-none pointer-events-none"
              draggable={false}
              loading="lazy"
            />
          ) : (
            <div className="h-full w-full grid place-items-center text-bone-200/40 text-sm">
              sem preview
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink-900/80 via-transparent to-transparent" />
          <div className="absolute top-4 left-4 flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-lime-400" />
            <span className="text-[11px] uppercase tracking-widest text-bone-50 font-medium">
              ao vivo
            </span>
          </div>
        </div>
        <div className="p-5 md:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="font-display font-bold text-bone-50 text-xl md:text-2xl tracking-tight truncate">
                {project.name}
              </h3>
              {host && (
                <p className="mt-1 text-xs md:text-sm text-bone-200/60 truncate">{host}</p>
              )}
            </div>
            <span className="shrink-0 h-10 w-10 rounded-full border border-white/15 grid place-items-center text-bone-50 group-hover:border-lime-400 group-hover:text-lime-400 group-hover:bg-lime-400/10 transition-all">
              <ArrowUpRight className="h-4 w-4" strokeWidth={2.5} />
            </span>
          </div>
          {project.description && (
            <p className="mt-4 text-sm md:text-base text-bone-200/80 leading-relaxed line-clamp-3">
              {project.description}
            </p>
          )}
        </div>
      </a>
    </article>
  );
}

function safeHost(url: string) {
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return null;
  }
}
