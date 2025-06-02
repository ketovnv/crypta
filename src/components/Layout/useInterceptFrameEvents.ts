// useInterceptFrameEvents.ts
import { useEffect } from "react";
// @ts-ignore
import { eventsStore } from "@stores/events"; // путь подкорректируй

type FrameEvent = { type: string; [key: string]: any };

export function useInterceptFrameEvents(w3mFrame: any) {
  useEffect(() => {
    const frame = w3mFrame?.events;
    if (!frame?.onFrameEvent || (frame as any).__patched) return;

    const original = frame.onFrameEvent;

    frame.onFrameEvent = (callback: (event: FrameEvent) => void) => {
      original((event: FrameEvent) => {
        // 🎯 Преобразуем в формат, который ест eventsStore
        const adapted = {
          data: {
            event: event.type || "UNKNOWN",
            properties: event,
          },
          timestamp: Date.now(),
          reportedErrors: event?.error ? { error: event.error } : {},
        };

        eventsStore.events = [...(eventsStore.events || []), adapted];

        eventsStore.addEvent(adapted); // для возможного логгирования и уведомлений

        callback(event);
      });
    };

    (frame as any).__patched = true;
    console.log("📡 W3mFrame события теперь проходят через eventsStore");
  }, [w3mFrame]);
}
