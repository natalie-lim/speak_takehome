"use client";

import Image from "next/image";
import Logo from "../assets/logo.png";
import type { Course } from "./types";

type RecordProps = {
  course?: Course | null;
  lessonTitle?: string | null;
};

export default function Record({ course, lessonTitle }: RecordProps) {
  const languageName = course?.name ?? "your target language";

  return (
    <section className="flex h-screen w-full flex-col justify-between px-6 pb-12 pt-10 text-center text-slate-600">
      <div className="flex flex-col items-center gap-2">
        <Image src={Logo} className="h-12 w-12" alt="Speak logo" />
        <h1 className="text-3xl font-semibold text-slate-900">Speak</h1>
        <p className="font-medium text-slate-800">Practice {languageName}</p>
        {lessonTitle ? (
          <p className="text-slate-500">
            Warm-up focus: <span className="font-semibold">{lessonTitle}</span>
          </p>
        ) : (
          <p className="text-slate-500">
            Let&apos;s see how much you&apos;ve learned today!
          </p>
        )}
      </div>

      <div className="flex justify-center">
        <button
          type="button"
          className="group flex h-14 w-14 items-center justify-center rounded-full bg-white transition"
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
      </div>
    </section>
  );
}
