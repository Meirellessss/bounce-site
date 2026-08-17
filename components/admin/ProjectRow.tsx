"use client";

import { useState, useTransition } from "react";
import {
  deleteProject,
  moveProject,
  regenerateScreenshot,
  updateProject,
} from "@/app/admin/actions";
import type { Project } from "@/lib/types";
import { ChevronDown, ChevronUp, RefreshCw, Trash2, Pencil, X, Check, ExternalLink } from "lucide-react";
import clsx from "clsx";

export function ProjectRow({ project, isFirst, isLast }: { project: Project; isFirst: boolean; isLast: boolean }) {
  const [pending, startTransition] = useTransition();
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="rounded-2xl border border-white/10 bg-ink-800/60 overflow-hidden">
      <div className="grid md:grid-cols-[220px_1fr_auto] gap-4 p-4 md:p-5 items-start">
        <div className="rounded-xl overflow-hidden bg-ink-900 aspect-[16/11] w-full md:w-[220px] relative">
          {project.screenshot_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.screenshot_url}
              alt=""
              className="h-full w-full object-cover object-top"
            />
          ) : (
            <div className="h-full w-full grid place-items-center text-bone-200/40 text-xs">
              sem preview
            </div>
          )}
        </div>

        {editing ? (
          <form
            action={(fd) => {
              setError(null);
              startTransition(async () => {
                const res = await updateProject(project.id, fd);
                if (res?.error) setError(res.error);
                else setEditing(false);
              });
            }}
            className="space-y-2"
          >
            <input name="name" defaultValue={project.name} required
              className="w-full rounded-lg border border-white/10 bg-ink-900 px-3 py-2 text-bone-50 outline-none focus:border-lime-400" />
            <input name="url" defaultValue={project.url} required
              className="w-full rounded-lg border border-white/10 bg-ink-900 px-3 py-2 text-bone-50 outline-none focus:border-lime-400 text-sm" />
            <textarea name="description" defaultValue={project.description ?? ""} rows={2}
              className="w-full rounded-lg border border-white/10 bg-ink-900 px-3 py-2 text-bone-50 outline-none focus:border-lime-400 text-sm resize-none" />
            {error && <div className="text-xs text-red-300">{error}</div>}
            <div className="flex gap-2">
              <button type="submit" disabled={pending}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-lime-400 text-black text-xs font-semibold">
                <Check className="h-3.5 w-3.5" /> Salvar
              </button>
              <button type="button" onClick={() => setEditing(false)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-white/10 text-bone-200 text-xs">
                <X className="h-3.5 w-3.5" /> Cancelar
              </button>
            </div>
          </form>
        ) : (
          <div className="min-w-0">
            <h3 className="font-display font-bold text-bone-50 text-lg truncate">{project.name}</h3>
            <a href={project.url} target="_blank" rel="noopener noreferrer"
              className="text-xs text-bone-200/60 inline-flex items-center gap-1 hover:text-lime-400 truncate max-w-full">
              {project.url}
              <ExternalLink className="h-3 w-3 shrink-0" />
            </a>
            {project.description && (
              <p className="mt-2 text-sm text-bone-200/80 line-clamp-2">{project.description}</p>
            )}
          </div>
        )}

        <div className="flex md:flex-col gap-1.5 shrink-0">
          <IconBtn
            aria-label="Subir"
            disabled={isFirst || pending}
            onClick={() => startTransition(() => moveProject(project.id, "up") as unknown as void)}
          >
            <ChevronUp className="h-4 w-4" />
          </IconBtn>
          <IconBtn
            aria-label="Descer"
            disabled={isLast || pending}
            onClick={() => startTransition(() => moveProject(project.id, "down") as unknown as void)}
          >
            <ChevronDown className="h-4 w-4" />
          </IconBtn>
          <IconBtn
            aria-label="Regenerar screenshot"
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                const res = await regenerateScreenshot(project.id, project.url);
                if (res?.error) setError(res.error);
              })
            }
          >
            <RefreshCw className={clsx("h-4 w-4", pending && "animate-spin")} />
          </IconBtn>
          <IconBtn
            aria-label="Editar"
            disabled={pending}
            onClick={() => setEditing((v) => !v)}
          >
            <Pencil className="h-4 w-4" />
          </IconBtn>
          <IconBtn
            aria-label="Excluir"
            danger
            disabled={pending}
            onClick={() => {
              if (!confirm(`Excluir "${project.name}"?`)) return;
              startTransition(() => deleteProject(project.id) as unknown as void);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </IconBtn>
        </div>
      </div>
    </div>
  );
}

function IconBtn({
  children, danger, ...props
}: { children: React.ReactNode; danger?: boolean } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={clsx(
        "h-9 w-9 grid place-items-center rounded-lg border transition-colors",
        "border-white/10 text-bone-200/80",
        !props.disabled && !danger && "hover:border-lime-400 hover:text-lime-400",
        !props.disabled && danger && "hover:border-red-400/60 hover:text-red-400",
        props.disabled && "opacity-40 cursor-not-allowed"
      )}
    >
      {children}
    </button>
  );
}
