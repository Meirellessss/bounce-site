import Link from "next/link";
import { Instagram } from "lucide-react";
import { INSTAGRAM_URL, INSTAGRAM_HANDLE } from "@/lib/contact";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-ink-950 py-10">
      <div className="mx-auto max-w-6xl px-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <img src="/brand/bounce-mark.svg" alt="" className="h-8 w-8" />
          <div>
            <div className="font-display italic font-extrabold text-bone-50 tracking-tightest text-lg leading-none">
              BOUNCE
            </div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-lime-400 mt-1">
              Agência
            </div>
          </div>
        </div>

        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2.5 text-bone-200/70 hover:text-lime-400 transition-colors"
        >
          <span className="grid h-9 w-9 place-items-center rounded-full border border-white/15 group-hover:border-lime-400/60 transition-colors">
            <Instagram className="h-[18px] w-[18px]" />
          </span>
          <span className="text-sm">@{INSTAGRAM_HANDLE}</span>
        </a>

        <div className="flex items-center gap-5">
          <span className="text-xs text-bone-200/50 uppercase tracking-widest">
            © {new Date().getFullYear()} Agência Bounce
          </span>
          <Link
            href="/admin"
            className="text-xs text-bone-200/40 hover:text-lime-400 transition-colors"
          >
            admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
