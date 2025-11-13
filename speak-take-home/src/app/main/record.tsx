"use client";

import { useMemo } from "react";
import Image from "next/image";
import Logo from "../assets/logo.png";
import type { Course } from "./types";
import { useSpeakSocketLite } from "./useSpeakSocket";

type RecordProps = {
  course: Course | null;
  lessonTitle?: string | null;
};

export default function Record({ course, lessonTitle }: RecordProps) {
  const { connect, start, disconnect, connected, error, messages } =
    useSpeakSocketLite();

  const languageName = course?.name ?? "your target language";
  const currentLesson = useMemo(
    () => lessonTitle ?? course?.lessons?.[0]?.title,
    [course, lessonTitle]
  );

  return (
    <section className="flex h-screen w-full flex-col gap-6 px-6 pb-12 pt-10 text-slate-600">
      <div className="flex flex-col items-center gap-2 text-center">
        <Image src={Logo} className="h-12 w-12" alt="Speak logo" />
        <h1 className="text-3xl font-semibold text-slate-900">Speak</h1>
        <p className="font-medium text-slate-800">
          Practice {languageName}
          {currentLesson ? ` • ${currentLesson}` : ""}
        </p>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
          {connected ? "Connected" : "Disconnected"}
        </p>
      </div>

      <div className="flex gap-3 justify-center">
        <button
          type="button"
          onClick={connect}
          className="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-white shadow"
        >
          Connect
        </button>
        <button
          type="button"
          onClick={() => start(course, currentLesson)}
          className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow"
        >
          Start session
        </button>
        <button
          type="button"
          onClick={disconnect}
          className="rounded-full bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 shadow"
        >
          Disconnect
        </button>
      </div>

      {error && <p className="text-center text-xs text-rose-500">{error}</p>}

      <div className="flex-1 overflow-auto rounded-3xl border border-slate-200 bg-white/90 p-4 text-left shadow">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
          Messages
        </p>
        <ul className="mt-2 space-y-2 text-sm text-slate-600">
          {messages.length === 0 && <li>No socket messages yet.</li>}
          {messages.map((msg, index) => (
            <li key={index} className="whitespace-pre-wrap">
              {msg}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
