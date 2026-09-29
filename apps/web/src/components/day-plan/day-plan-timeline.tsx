"use client";

import { IconTrash } from "@/components/icon-trash";
import {
  IconDayPlanEdit,
  IconTimelineMarker,
  IconTimelineMarkerMobile,
} from "@/components/day-plan/day-plan-icons";
import { formatDurationUk, type DayPlanEvent } from "@/lib/day-plan";

type Props = {
  events: DayPlanEvent[];
  onEdit: (event: DayPlanEvent) => void;
  onDelete: (event: DayPlanEvent) => void;
};

export function DayPlanTimeline({ events, onEdit, onDelete }: Props) {
  if (!events.length) return null;

  return (
    <ol className="cabinet-day-plan-timeline">
      {events.map((event) => (
        <li key={event.id} className="cabinet-day-plan-row">
          <time className="cabinet-day-plan-time" dateTime={event.time}>
            {event.time}
          </time>

          <span className="cabinet-day-plan-marker" aria-hidden>
            <IconTimelineMarker className="cabinet-day-plan-marker-desktop" />
            <IconTimelineMarkerMobile className="cabinet-day-plan-marker-mobile" />
          </span>

          <article className="cabinet-day-plan-card">
            <div className="cabinet-day-plan-card-main">
              <h3 className="cabinet-day-plan-card-title">{event.title}</h3>
              <span className="cabinet-day-plan-card-duration">
                {formatDurationUk(event.durationMin)}
              </span>
            </div>
            <div className="cabinet-day-plan-card-actions">
              <button
                type="button"
                className="cabinet-day-plan-icon-btn cabinet-day-plan-icon-btn--edit"
                aria-label={`Редагувати «${event.title}»`}
                onClick={() => onEdit(event)}
              >
                <IconDayPlanEdit size={20} />
              </button>
              <button
                type="button"
                className="cabinet-day-plan-icon-btn cabinet-day-plan-icon-btn--trash"
                aria-label={`Видалити «${event.title}»`}
                onClick={() => onDelete(event)}
              >
                <IconTrash size={16} />
              </button>
            </div>
          </article>
        </li>
      ))}
    </ol>
  );
}
