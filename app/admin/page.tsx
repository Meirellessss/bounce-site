import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "./actions";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { ProjectRow } from "@/components/admin/ProjectRow";
import type { Project } from "@/lib/types";
import { LogOut } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin — Agência Bounce" };

export default async function AdminHome() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  const projects = (data ?? []) as Project[];

  return (
    <main className="min-h-screen bg-ink-950 text-bone-50">
      <header className="border-b border-white/5 bg-ink-950/80 backdrop-blur-md sticky top-0 z-30">
        <div className="mx-auto max-w-5xl px-5 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <img src="/brand/bounce-mark.svg" alt="" className="h-7 w-7" />
            <span className="font-display font-extrabold italic tracking-tightest text-bone-50">
              BOUNCE <span className="text-lime-400">/ admin</span>
            </span>
          </Link>
          <form action={signOut}>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-bone-200/70 hover:text-lime-400 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              sair
            </button>
          </form>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-5 py-10 space-y-10">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-lime-400 font-medium">
            Logado como {user?.email}
          </p>
          <h1 className="mt-3 font-display italic font-extrabold text-4xl md:text-5xl tracking-tightest leading-[0.95]">
            Projetos no carrossel
          </h1>
          <p className="mt-3 text-bone-200/70 max-w-xl">
            Cole a URL de um site (Vercel, Netlify, domínio próprio) e ele aparece no carrossel
            da home com screenshot automático. Sem redeploy.
          </p>
        </div>

        <ProjectForm />

        <div className="space-y-3">
          <div className="flex items-baseline gap-3">
            <h2 className="font-display font-bold text-xl">Cadastrados</h2>
            <span className="text-xs text-bone-200/50">
              {projects.length} {projects.length === 1 ? "projeto" : "projetos"}
            </span>
          </div>

          {projects.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-bone-200/60">
              Nenhum projeto ainda. Adicione o primeiro acima.
            </div>
          ) : (
            <div className="space-y-3">
              {projects.map((p, i) => (
                <ProjectRow
                  key={p.id}
                  project={p}
                  isFirst={i === 0}
                  isLast={i === projects.length - 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
