"use client";

import Image from "next/image";
import Logo from "../assets/logo.webp";

export default function Record() {
  return (
    <section className="flex flex-col items-center justify-center text-center text-slate-600">
      <div className="flex flex-col items-center justify-center gap-2">
        <Image src={Logo} className="h-12 w-12" alt="Speak logo" />
        <h1 className="text-3xl font-semibold text-slate-900">Speak</h1>
      </div>

      <div className="mt-8 space-y-1 text-sm">
        <p className="font-medium text-slate-800">
          Practice your target language
        </p>
        <p className="text-slate-500">
          Let&apos;s see how much you&apos;ve learned today!
        </p>
      </div>

      <button
        type="button"
        className="group mt-48 flex h-14 w-14 items-center justify-center rounded-full bg-white transition"
        aria-label="Start recording"
      >
        <span className="relative flex h-12 w-12 items-center justify-center rounded-full border border-slate-700">
          <span
            className="absolute inset-0 rounded-full border-2 border-red-400 opacity-60 transition group-hover:animate-ping"
            aria-hidden
          />
          <span className="block h-9 w-9 rounded-full bg-red-500 shadow-inner transition group-hover:scale-105 group-hover:bg-red-600" />
        </span>
      </button>
    </section>
  );
}
