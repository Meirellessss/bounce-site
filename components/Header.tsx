"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import clsx from "clsx";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={clsx(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled ? "backdrop-blur-md bg-ink-950/70 border-b border-white/5" : "bg-transparent"
      )}
    >
      <div className="mx-auto max-w-6xl px-5 py-3.5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <img src="/brand/bounce-mark.svg" alt="" className="h-8 w-8" />
          <span className="font-display font-extrabold italic text-lg tracking-tightest text-bone-50 group-hover:text-lime-400 transition-colors">
            BOUNCE
          </span>
        </Link>
        <span className="text-[10px] uppercase tracking-[0.3em] text-bone-200/60 font-medium">
          Agência
        </span>
      </div>
    </header>
  );
}
