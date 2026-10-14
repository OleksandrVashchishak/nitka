"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { IconTrash } from "@/components/icon-trash";
import {
  IconDayPlanEdit,
  IconDayPlanGrip,
  IconTimelineMarker,
  IconTimelineMarkerMobile,
} from "@/components/day-plan/day-plan-icons";
import { formatDurationUk, type DayPlanEvent } from "@/lib/day-plan";
import "@/styles/cabinet/day-plan.scss";

const EXIT_MS = 300;
const DRAG_THRESHOLD_PX = 4;

type Props = {
  events: DayPlanEvent[];
  readOnly?: boolean;
  onEdit?: (event: DayPlanEvent) => void;
  onDelete?: (event: DayPlanEvent) => void;
  onReorder?: (fromIndex: number, toIndex: number) => void;
};

type DisplayItem = {
  event: DayPlanEvent;
  key: string;
  exiting: boolean;
  stagger: number;
};

type DragGhost = {
  id: string;
  title: string;
  durationMin: number;
  width: number;
  height: number;
  x: number;
  y: number;
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

export function DayPlanTimeline({
  events,
  readOnly = false,
  onEdit,
  onDelete,
  onReorder,
}: Props) {
  const canReorder = !readOnly && Boolean(onReorder);
  const canMutate = !readOnly && Boolean(onEdit && onDelete);
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
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragFromIndex, setDragFromIndex] = useState<number | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);
  const [ghost, setGhost] = useState<DragGhost | null>(null);
  const reducedRef = useRef(false);
  const skipEnterDelayRef = useRef(true);
  const rowRefs = useRef<Map<string, HTMLLIElement>>(new Map());
  const cardRefs = useRef<Map<string, HTMLElement>>(new Map());
  const dragRef = useRef<{
    id: string;
    fromIndex: number;
    toIndex: number;
    startY: number;
    pointerId: number;
    moved: boolean;
    offsetX: number;
    offsetY: number;
    width: number;
    height: number;
  } | null>(null);

  useLayoutEffect(() => {
    reducedRef.current = prefersReducedMotion();
  }, []);

  useEffect(() => {
    if (dragRef.current) return;
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

  function liveItems() {
    return display.filter((d) => !d.exiting);
  }

  /** Index among siblings excluding the dragged row. */
  function insertAmongFromClientY(clientY: number, excludeId: string): number {
    const siblings = liveItems().filter((item) => item.key !== excludeId);
    for (let i = 0; i < siblings.length; i++) {
      const el = rowRefs.current.get(siblings[i].key);
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      if (clientY < rect.top + rect.height / 2) return i;
    }
    return siblings.length;
  }

  function onGripPointerDown(
    event: ReactPointerEvent<HTMLButtonElement>,
    item: DisplayItem,
  ) {
    if (!canReorder || item.exiting || event.button !== 0) return;
    const live = liveItems();
    const fromIndex = live.findIndex((d) => d.key === item.key);
    if (fromIndex < 0) return;

    const card = cardRefs.current.get(item.key);
    const rect = card?.getBoundingClientRect();
    if (!rect) return;

    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);

    dragRef.current = {
      id: item.key,
      fromIndex,
      toIndex: fromIndex,
      startY: event.clientY,
      pointerId: event.pointerId,
      moved: false,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
      width: rect.width,
      height: rect.height,
    };
  }

  function onGripPointerMove(event: ReactPointerEvent<HTMLButtonElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    if (!drag.moved) {
      if (Math.abs(event.clientY - drag.startY) < DRAG_THRESHOLD_PX) return;
      drag.moved = true;
      const live = liveItems();
      const source = live.find((d) => d.key === drag.id);
      if (!source) return;

      setDraggingId(drag.id);
      setDragFromIndex(drag.fromIndex);
      setGhost({
        id: drag.id,
        title: source.event.title,
        durationMin: source.event.durationMin,
        width: drag.width,
        height: drag.height,
        x: event.clientX - drag.offsetX,
        y: event.clientY - drag.offsetY,
      });
      setDropIndex(drag.fromIndex);
    }

    setGhost((prev) =>
      prev
        ? {
            ...prev,
            x: event.clientX - drag.offsetX,
            y: event.clientY - drag.offsetY,
          }
        : prev,
    );

    const nextTo = insertAmongFromClientY(event.clientY, drag.id);
    if (nextTo !== drag.toIndex) {
      drag.toIndex = nextTo;
      setDropIndex(nextTo);
    }
  }

  function endDrag(event: ReactPointerEvent<HTMLButtonElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    const { fromIndex, toIndex, moved } = drag;
    dragRef.current = null;
    setDraggingId(null);
    setDragFromIndex(null);
    setDropIndex(null);
    setGhost(null);

    if (!moved || fromIndex === toIndex) return;
    onReorder?.(fromIndex, toIndex);
  }

  if (!display.length) return null;

  const live = liveItems();
  const others = draggingId
    ? live.filter((item) => item.key !== draggingId)
    : [];
  const dropMoved =
    draggingId !== null &&
    dropIndex !== null &&
    dragFromIndex !== null &&
    dropIndex !== dragFromIndex;
  const dropLineBeforeKey =
    dropMoved && dropIndex < others.length
      ? (others[dropIndex]?.key ?? null)
      : null;
  const dropLineAfterLast = Boolean(
    dropMoved && dropIndex >= others.length && others.length > 0,
  );

  return (
    <>
      <ol
        className={[
          "cabinet-day-plan-timeline",
          draggingId ? "is-reordering" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {display.map((item) => {
          const isVisible = visibleIds.has(item.key) && !item.exiting;
          const isDragging = draggingId === item.key;
          const showDropBefore = dropLineBeforeKey === item.key;
          const showDropAfter =
            dropLineAfterLast &&
            !item.exiting &&
            item.key === others[others.length - 1]?.key;

          return (
            <li
              key={item.key}
              ref={(el) => {
                if (el) rowRefs.current.set(item.key, el);
                else rowRefs.current.delete(item.key);
              }}
              className={[
                "cabinet-day-plan-row-shell",
                isVisible ? "is-visible" : "",
                item.exiting ? "is-exiting" : "",
                isDragging ? "is-dragging" : "",
                showDropBefore ? "has-drop-before" : "",
                showDropAfter ? "has-drop-after" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              style={{ ["--row-i" as string]: item.stagger }}
              aria-hidden={item.exiting || undefined}
            >
              <div className="cabinet-day-plan-row-shell-inner">
                <div className="cabinet-day-plan-row">
                  <time
                    className="cabinet-day-plan-time"
                    dateTime={item.event.time}
                  >
                    {item.event.time}
                  </time>

                  <span className="cabinet-day-plan-marker" aria-hidden>
                    <IconTimelineMarker className="cabinet-day-plan-marker-desktop" />
                    <IconTimelineMarkerMobile className="cabinet-day-plan-marker-mobile" />
                  </span>

                  <article
                    className="cabinet-day-plan-card"
                    ref={(el) => {
                      if (el) cardRefs.current.set(item.key, el);
                      else cardRefs.current.delete(item.key);
                    }}
                  >
                    {canReorder ? (
                      <button
                        type="button"
                        className="cabinet-day-plan-drag-handle"
                        aria-label={`Пересунути «${item.event.title}»`}
                        disabled={item.exiting}
                        onPointerDown={(e) => onGripPointerDown(e, item)}
                        onPointerMove={onGripPointerMove}
                        onPointerUp={endDrag}
                        onPointerCancel={endDrag}
                      >
                        <IconDayPlanGrip />
                      </button>
                    ) : null}
                    <div className="cabinet-day-plan-card-main">
                      <h3 className="cabinet-day-plan-card-title">
                        {item.event.title}
                      </h3>
                      <span className="cabinet-day-plan-card-duration">
                        {formatDurationUk(item.event.durationMin)}
                      </span>
                    </div>
                    {canMutate ? (
                      <div className="cabinet-day-plan-card-actions">
                        <button
                          type="button"
                          className="cabinet-day-plan-icon-btn cabinet-day-plan-icon-btn--edit"
                          aria-label={`Редагувати «${item.event.title}»`}
                          disabled={item.exiting || Boolean(draggingId)}
                          onClick={() => onEdit?.(item.event)}
                        >
                          <IconDayPlanEdit size={20} />
                        </button>
                        <button
                          type="button"
                          className="cabinet-day-plan-icon-btn cabinet-day-plan-icon-btn--trash"
                          aria-label={`Видалити «${item.event.title}»`}
                          disabled={item.exiting || Boolean(draggingId)}
                          onClick={() => onDelete?.(item.event)}
                        >
                          <IconTrash size={16} />
                        </button>
                      </div>
                    ) : null}
                  </article>
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      {ghost ? (
        <div
          className="cabinet-day-plan-drag-ghost"
          style={{
            width: ghost.width,
            height: ghost.height,
            transform: `translate3d(${ghost.x}px, ${ghost.y}px, 0) rotate(1.5deg) scale(1.03)`,
          }}
          aria-hidden
        >
          <span className="cabinet-day-plan-drag-handle" aria-hidden>
            <IconDayPlanGrip />
          </span>
          <div className="cabinet-day-plan-card-main">
            <h3 className="cabinet-day-plan-card-title">{ghost.title}</h3>
            <span className="cabinet-day-plan-card-duration">
              {formatDurationUk(ghost.durationMin)}
            </span>
          </div>
        </div>
      ) : null}
    </>
  );
}
