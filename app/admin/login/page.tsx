import Link from "next/link";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata = { title: "Admin — Agência Bounce" };

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-ink-950 grid place-items-center px-5 py-16 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(200,255,77,0.1),transparent_60%)]" />
      <div className="w-full max-w-sm">
        <Link href="/" className="inline-flex items-center gap-2.5 mb-10">
          <img src="/brand/bounce-mark.svg" alt="" className="h-8 w-8" />
          <span className="font-display font-extrabold italic text-lg tracking-tightest text-bone-50">
            BOUNCE
          </span>
        </Link>
        <h1 className="font-display italic font-extrabold text-bone-50 text-4xl md:text-5xl tracking-tightest leading-[0.95] mb-2">
          Admin
        </h1>
        <p className="text-bone-200/70 mb-8">
          Painel restrito. Entre para gerenciar os projetos que aparecem no site.
        </p>
        <LoginForm />
      </div>
    </main>
  );
}
