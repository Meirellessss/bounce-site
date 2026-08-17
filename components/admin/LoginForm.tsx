"use client";

import { useState, useTransition } from "react";
import { signIn, signUp } from "@/app/admin/actions";
import { ArrowRight } from "lucide-react";

export function LoginForm() {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <form
      action={(fd) => {
        setError(null);
        setInfo(null);
        startTransition(async () => {
          const action = mode === "in" ? signIn : signUp;
          const res = await action(fd);
          if (res && "error" in res && res.error) setError(res.error);
          if (res && "info" in res && res.info) setInfo(res.info);
        });
      }}
      className="w-full max-w-sm space-y-5"
    >
      <div className="flex gap-1 p-1 rounded-full border border-white/10 bg-ink-800/60 w-fit">
        {(["in", "up"] as const).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setMode(k)}
            className={`px-4 py-1.5 rounded-full text-xs uppercase tracking-widest font-medium transition-colors ${
              mode === k ? "bg-lime-400 text-black" : "text-bone-200/70 hover:text-bone-50"
            }`}
          >
            {k === "in" ? "Entrar" : "Criar"}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        <label className="block">
          <span className="text-xs uppercase tracking-wider text-bone-200/60">E-mail</span>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            className="mt-1 w-full rounded-xl border border-white/10 bg-ink-900 px-4 py-3 text-bone-50 outline-none focus:border-lime-400 focus:ring-2 focus:ring-lime-400/20 transition"
          />
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-wider text-bone-200/60">Senha</span>
          <input
            type="password"
            name="password"
            required
            minLength={6}
            autoComplete={mode === "in" ? "current-password" : "new-password"}
            className="mt-1 w-full rounded-xl border border-white/10 bg-ink-900 px-4 py-3 text-bone-50 outline-none focus:border-lime-400 focus:ring-2 focus:ring-lime-400/20 transition"
          />
        </label>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}
      {info && (
        <div className="rounded-xl border border-lime-400/30 bg-lime-400/10 px-4 py-3 text-sm text-lime-200">
          {info}
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="group inline-flex items-center justify-center gap-2 w-full px-6 py-4 rounded-full bg-lime-400 text-black font-semibold hover:shadow-glow disabled:opacity-50 transition-shadow"
      >
        {pending ? "Aguarde..." : mode === "in" ? "Entrar" : "Criar conta"}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </button>
    </form>
  );
}
