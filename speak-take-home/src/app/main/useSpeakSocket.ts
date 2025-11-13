import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Course } from "./types";

const WS_URL =
  process.env.NEXT_PUBLIC_SPEAK_PROXY_WS ?? "ws://localhost:4000/ws";
const AUDIO_ENDPOINT = `${
  process.env.NEXT_PUBLIC_SPEAK_PROXY_HTTP ?? "http://localhost:4000"
}/audio`;

export function useSpeakSocketLite() {
  const wsRef = useRef<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const metadataTriggeredRef = useRef(false);

  const connect = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      return;
    }
    setError(null);
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.addEventListener("open", () => {
      setConnected(true);
      setMessages((prev) => [...prev, "[open] connection established"]);
    });

    ws.addEventListener("message", async (event) => {
      setMessages((prev) => [...prev, event.data as string]);
      try {
        const payload = JSON.parse(event.data as string) as {
          type?: string;
        };
        if (payload.type === "asrMetadata" && !metadataTriggeredRef.current) {
          metadataTriggeredRef.current = true;
          await streamChunks();
        }
      } catch (err) {
        console.warn("non JSON message", event.data);
      }
    });

    ws.addEventListener("close", () => {
      setConnected(false);
      setMessages((prev) => [...prev, "[close]"]);
      wsRef.current = null;
    });

    ws.addEventListener("error", () => {
      setError("WebSocket error");
      ws.close();
    });
  }, []);

  const sendJson = useCallback((payload: unknown) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    wsRef.current.send(JSON.stringify(payload));
  }, []);

  const streamChunks = useCallback(async () => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    const response = await fetch(AUDIO_ENDPOINT);
    if (!response.ok) {
      setError(`Failed to fetch audio: ${response.statusText}`);
      return;
    }
    const chunks = (await response.json()) as Array<{
      type: string;
      chunk: string;
      isFinal: boolean;
    }>;

    for (const chunk of chunks) {
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) break;
      wsRef.current.send(JSON.stringify(chunk));
      await new Promise((r) => setTimeout(r, 40));
    }
  }, []);

  const start = useCallback(() => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      setError("Socket not connected");
      return;
    }
    metadataTriggeredRef.current = false;
    sendJson({
      type: "asrStart",
      lessonId: "lessonId",
      learningLocale: "en-US",
      metadata: {
        recording: {
          lessonId: "lessonId",
          lineId: "lineId",
        },
        deviceAudio: {
          inputSampleRate: 16000,
        },
      },
    });
  }, [sendJson]);

  const disconnect = useCallback(() => {
    metadataTriggeredRef.current = false;
    if (wsRef.current) {
      wsRef.current.close();
    }
  }, []);

  useEffect(() => () => disconnect(), [disconnect]);

  const api = useMemo(
    () => ({ connect, start, disconnect, connected, error, messages }),
    [connect, start, disconnect, connected, error, messages]
  );

  return api;
}
