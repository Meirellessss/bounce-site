"use client";

import { useState, useTransition } from "react";
import { createProject } from "@/app/admin/actions";
import { Plus } from "lucide-react";

export function ProjectForm() {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <form
      action={(fd) => {
        setError(null);
        startTransition(async () => {
          const res = await createProject(fd);
          if (res?.error) setError(res.error);
          else {
            (document.getElementById("project-form") as HTMLFormElement | null)?.reset();
          }
        });
      }}
      id="project-form"
      className="rounded-2xl border border-white/10 bg-ink-800/60 p-5 md:p-6 space-y-4"
    >
      <div className="flex items-center gap-2 mb-1">
        <Plus className="h-4 w-4 text-lime-400" />
        <h2 className="font-display font-bold text-bone-50 text-lg">Adicionar site</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        <label className="block">
          <span className="text-xs uppercase tracking-wider text-bone-200/60">Nome</span>
          <input
            name="name"
            required
            placeholder="Ex: Boteco da Esquina"
            className="mt-1 w-full rounded-xl border border-white/10 bg-ink-900 px-4 py-3 text-bone-50 outline-none focus:border-lime-400 focus:ring-2 focus:ring-lime-400/20 transition"
          />
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-wider text-bone-200/60">URL</span>
          <input
            name="url"
            required
            placeholder="botecodaesquina.vercel.app"
            className="mt-1 w-full rounded-xl border border-white/10 bg-ink-900 px-4 py-3 text-bone-50 outline-none focus:border-lime-400 focus:ring-2 focus:ring-lime-400/20 transition"
          />
        </label>
      </div>

      <label className="block">
        <span className="text-xs uppercase tracking-wider text-bone-200/60">
          Descrição (opcional)
        </span>
        <textarea
          name="description"
          rows={3}
          placeholder="Uma frase curta sobre o projeto."
          className="mt-1 w-full rounded-xl border border-white/10 bg-ink-900 px-4 py-3 text-bone-50 outline-none focus:border-lime-400 focus:ring-2 focus:ring-lime-400/20 transition resize-none"
        />
      </label>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-lime-400 text-black font-semibold text-sm hover:shadow-glow disabled:opacity-50 transition-shadow"
        >
          {pending ? "Gerando screenshot..." : "Adicionar ao carrossel"}
        </button>
        <p className="text-xs text-bone-200/50">
          Screenshot é capturado automaticamente ao salvar.
        </p>
      </div>
    </form>
  );
}
