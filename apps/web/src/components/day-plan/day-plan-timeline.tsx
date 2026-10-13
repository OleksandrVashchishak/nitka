"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { IconTrash } from "@/components/icon-trash";
import {
  IconDayPlanEdit,
  IconTimelineMarker,
  IconTimelineMarkerMobile,
} from "@/components/day-plan/day-plan-icons";
import { formatDurationUk, type DayPlanEvent } from "@/lib/day-plan";
import "@/styles/cabinet/day-plan.scss";

const EXIT_MS = 300;

type Props = {
  events: DayPlanEvent[];
  onEdit: (event: DayPlanEvent) => void;
  onDelete: (event: DayPlanEvent) => void;
};

type DisplayItem = {
  event: DayPlanEvent;
  key: string;
  exiting: boolean;
  stagger: number;
};

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function syncDisplay(
  prev: DisplayItem[],
  events: DayPlanEvent[],
): DisplayItem[] {
  const nextIds = new Set(events.map((e) => e.id));
  const prevById = new Map(prev.map((item) => [item.key, item]));
  const result: DisplayItem[] = [];
  const placed = new Set<string>();
  let fresh = 0;

  for (const event of events) {
    const existing = prevById.get(event.id);
    if (existing && !existing.exiting) {
      result.push({
        event,
        key: event.id,
        exiting: false,
        stagger: existing.stagger,
      });
    } else {
      result.push({
        event,
        key: event.id,
        exiting: false,
        stagger: fresh++,
      });
    }
    placed.add(event.id);
  }

  prev.forEach((item, index) => {
    if (nextIds.has(item.key) || placed.has(item.key)) return;
    const insertAt = Math.min(index, result.length);
    result.splice(insertAt, 0, {
      event: item.event,
      key: item.key,
      exiting: true,
      stagger: item.stagger,
    });
    placed.add(item.key);
  });

  return result;
}

export function DayPlanTimeline({ events, onEdit, onDelete }: Props) {
  const [display, setDisplay] = useState<DisplayItem[]>(() =>
    events.map((event, index) => ({
      event,
      key: event.id,
      exiting: false,
      stagger: index,
    })),
  );
  const [visibleIds, setVisibleIds] = useState<Set<string>>(
    () => new Set(events.map((event) => event.id)),
  );
  const reducedRef = useRef(false);
  const skipEnterDelayRef = useRef(true);

  useLayoutEffect(() => {
    reducedRef.current = prefersReducedMotion();
  }, []);

  useEffect(() => {
    setDisplay((prev) => {
      const live = prev.filter((item) => !item.exiting);
      const unchanged =
        live.length === events.length &&
        !prev.some((item) => item.exiting) &&
        live.every((item, index) => {
          const event = events[index];
          return (
            item.key === event.id &&
            item.event.title === event.title &&
            item.event.time === event.time &&
            item.event.durationMin === event.durationMin
          );
        });
      if (unchanged) return prev;
      return syncDisplay(prev, events);
    });
  }, [events]);

  useLayoutEffect(() => {
    const liveIds = display
      .filter((item) => !item.exiting)
      .map((item) => item.key);

    if (reducedRef.current || skipEnterDelayRef.current) {
      skipEnterDelayRef.current = false;
      setVisibleIds(new Set(liveIds));
      return;
    }

    const raf = requestAnimationFrame(() => {
      setVisibleIds(new Set(liveIds));
    });
    return () => cancelAnimationFrame(raf);
  }, [display]);

  useEffect(() => {
    const exiting = display.filter((item) => item.exiting);
    if (!exiting.length) return;

    const ms = reducedRef.current ? 0 : EXIT_MS;
    const timer = window.setTimeout(() => {
      setDisplay((prev) => prev.filter((item) => !item.exiting));
    }, ms);
    return () => window.clearTimeout(timer);
  }, [display]);

  if (!display.length) return null;

  return (
    <ol className="cabinet-day-plan-timeline">
      {display.map((item) => {
        const isVisible = visibleIds.has(item.key) && !item.exiting;

        return (
          <li
            key={item.key}
            className={[
              "cabinet-day-plan-row-shell",
              isVisible ? "is-visible" : "",
              item.exiting ? "is-exiting" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            style={{ ["--row-i" as string]: item.stagger }}
            aria-hidden={item.exiting || undefined}
          >
            <div className="cabinet-day-plan-row-shell-inner">
              <div className="cabinet-day-plan-row">
                <time className="cabinet-day-plan-time" dateTime={item.event.time}>
                  {item.event.time}
                </time>

                <span className="cabinet-day-plan-marker" aria-hidden>
                  <IconTimelineMarker className="cabinet-day-plan-marker-desktop" />
                  <IconTimelineMarkerMobile className="cabinet-day-plan-marker-mobile" />
                </span>

                <article className="cabinet-day-plan-card">
                  <div className="cabinet-day-plan-card-main">
                    <h3 className="cabinet-day-plan-card-title">
                      {item.event.title}
                    </h3>
                    <span className="cabinet-day-plan-card-duration">
                      {formatDurationUk(item.event.durationMin)}
                    </span>
                  </div>
                  <div className="cabinet-day-plan-card-actions">
                    <button
                      type="button"
                      className="cabinet-day-plan-icon-btn cabinet-day-plan-icon-btn--edit"
                      aria-label={`Редагувати «${item.event.title}»`}
                      disabled={item.exiting}
                      onClick={() => onEdit(item.event)}
                    >
                      <IconDayPlanEdit size={20} />
                    </button>
                    <button
                      type="button"
                      className="cabinet-day-plan-icon-btn cabinet-day-plan-icon-btn--trash"
                      aria-label={`Видалити «${item.event.title}»`}
                      disabled={item.exiting}
                      onClick={() => onDelete(item.event)}
                    >
                      <IconTrash size={16} />
                    </button>
                  </div>
                </article>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
