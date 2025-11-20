"use client";

import { useEffect, useMemo, useState } from "react";
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
  const [sessionStarted, setSessionStarted] = useState(false);

  useEffect(() => {
    if (!connected) {
      setSessionStarted(false);
    }
  }, [connected]);

  const languageName = course?.name ?? "your target language";
  const currentLesson = useMemo(
    () => lessonTitle ?? course?.lessons?.[0]?.title,
    [course, lessonTitle]
  );

  const transcripts = useMemo(() => {
    return messages
      .map((msg) => {
        try {
          const parsed = JSON.parse(msg) as {
            type?: string;
            text?: string;
            isFinal?: boolean;
          };
          if (parsed.type === "asrResult") {
            return {
              text: parsed.text ?? "",
              isFinal: Boolean(parsed.isFinal),
            };
          }
        } catch {
          return null;
        }
        return null;
      })
      .filter(Boolean) as Array<{ text: string; isFinal: boolean }>;
  }, [messages]);

  const metadataReceived = useMemo(() => {
    return messages.some((msg) => msg.includes('"type":"asrMetadata"'));
  }, [messages]);

  const statusLabel = useMemo(() => {
    if (error) return "Error";
    if (!connected) return "Tap to connect";
    if (sessionStarted && metadataReceived) return "Streaming sample audio";
    if (sessionStarted) return "Awaiting metadata";
    return "Connected";
  }, [connected, sessionStarted, metadataReceived, error]);

  const handleRecordingClick = () => {
    if (!connected) {
      connect();
      return;
    }

    if (!sessionStarted) {
      setSessionStarted(true);
      void start();
      return;
    }

    disconnect();
  };

  return (
    <section className="flex justify-between h-screen w-full flex-col gap-6 px-6 pb-12 pt-10 text-slate-600">
      <div className="flex flex-col items-center gap-2 text-center">
        <Image src={Logo} className="h-12 w-12" alt="Speak logo" />
        <h1 className="text-3xl font-semibold text-slate-900">Speak</h1>
        <p className="font-medium text-slate-800">
          Practice {languageName}
          {currentLesson ? ` • ${currentLesson}` : ""}
        </p>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
          {statusLabel}
        </p>
      </div>

      <div className="flex justify-center flex-col items-center space-y-4">
        <button
          type="button"
          onClick={handleRecordingClick}
          className={`group flex h-14 w-14 items-center justify-center rounded-full transition ${
            sessionStarted ? "bg-red-500" : "bg-white"
          } ${sessionStarted ? "shadow-inner" : "shadow-lg hover:shadow-xl"}`}
          aria-label="Toggle sample stream"
        >
          <span className="relative flex h-12 w-12 items-center justify-center rounded-full border border-slate-700">
            <span
              className={`absolute inset-0 rounded-full border-2 border-red-400 opacity-60 transition ${
                sessionStarted ? "animate-ping" : "group-hover:animate-ping"
              }`}
              aria-hidden
            />
            <span
              className={`block h-9 w-9 rounded-full transition ${
                sessionStarted
                  ? "bg-white group-hover:bg-slate-200"
                  : "bg-red-500 group-hover:bg-red-600"
              }`}
            />
          </span>
        </button>
        {error && <p className="text-center text-xs text-rose-500">{error}</p>}
      </div>
    </section>
  );
}
