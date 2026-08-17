"use client";

import { motion } from "framer-motion";

export function ShowcaseIntro({ count }: { count: number }) {
  return (
    <div className="relative mx-auto max-w-6xl px-5 w-full">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center gap-3 mb-6"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-lime-400 shadow-glow" />
        <span className="text-xs uppercase tracking-[0.28em] text-bone-200/80 font-medium">
          {count > 0
            ? `${count} ${count === 1 ? "site" : "sites"} no ar`
            : "Portfólio"}
        </span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
        className="font-display italic font-extrabold text-bone-50 tracking-tightest leading-[0.92] text-[13vw] sm:text-[9vw] md:text-[7vw] lg:text-[6rem]"
      >
        Sites que a gente
        <br />
        <span className="text-bone-200/50">botou</span>{" "}
        <span className="relative inline-block">
          <span className="relative z-10">pra rodar</span>
          <span
            className="absolute inset-x-0 bottom-1 md:bottom-3 h-2.5 md:h-4 bg-lime-400/80 -z-0"
            aria-hidden
          />
        </span>
        .
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="mt-6 max-w-md text-base md:text-lg text-bone-100/80 leading-relaxed"
      >
        Toque em um card pra abrir o site real.
      </motion.p>
    </div>
  );
}
