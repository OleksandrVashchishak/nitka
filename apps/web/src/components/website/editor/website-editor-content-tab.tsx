"use client";

import { useState, type ReactNode } from "react";
import {
  IconCalendar,
  IconChevron,
  IconTrash,
  WebsiteToggle,
} from "@/components/website/editor/website-editor-toggle";
import { TextInput } from "@/components/ui/text-input";
import type {
  WebsiteContent,
  WebsiteScheduleItem,
  WebsiteSections,
} from "@/lib/website-api";

type BlockId = "hero" | "timer" | "schedule" | "about" | "details";

type Props = {
  content: WebsiteContent;
  brideName: string;
  groomName: string;
  onChange: (next: WebsiteContent) => void;
  onNamesChange: (bride: string, groom: string) => void;
};

function splitHeadline(headline: string): [string, string] {
  const parts = headline.split(/\s+(?:та|and|&)\s+/i);
  if (parts.length >= 2) return [parts[0].trim(), parts.slice(1).join(" ").trim()];
  return [headline.trim(), ""];
}

export function WebsiteEditorContentTab({
  content,
  brideName,
  groomName,
  onChange,
  onNamesChange,
}: Props) {
  const [open, setOpen] = useState<Record<BlockId, boolean>>({
    hero: true,
    timer: false,
    schedule: false,
    about: false,
    details: false,
  });

  const sections = content.sections;
  const detailsOn =
    sections.dressCode ||
    sections.registry ||
    sections.travel ||
    sections.gallery ||
    sections.rsvp ||
    sections.qa;

  function patch(partial: Partial<WebsiteContent>) {
    onChange({ ...content, ...partial });
  }

  function patchSections(partial: Partial<WebsiteSections>) {
    patch({ sections: { ...sections, ...partial } });
  }

  function toggleOpen(id: BlockId) {
    setOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function updateEvent(index: number, partial: Partial<WebsiteScheduleItem>) {
    const scheduleItems = content.scheduleItems.map((item, i) =>
      i === index ? { ...item, ...partial } : item,
    );
    patch({ scheduleItems });
  }

  function removeEvent(index: number) {
    patch({
      scheduleItems: content.scheduleItems.filter((_, i) => i !== index),
    });
  }

  function addEvent() {
    patch({
      scheduleItems: [
        ...content.scheduleItems,
        { time: "", title: "", detail: "" },
      ],
    });
  }

  function setDetailsMaster(on: boolean) {
    if (on) {
      patchSections({
        dressCode: true,
        registry: true,
        travel: sections.travel,
        gallery: sections.gallery,
        rsvp: sections.rsvp,
        qa: sections.qa,
      });
      return;
    }
    patchSections({
      dressCode: false,
      registry: false,
      travel: false,
      gallery: false,
      rsvp: false,
      qa: false,
    });
  }

  const bride = brideName || splitHeadline(content.headline)[0];
  const groom = groomName || splitHeadline(content.headline)[1];

  return (
    <section className="we-blocks" aria-labelledby="we-blocks-title">
      <div className="we-blocks__head">
        <h1 id="we-blocks-title" className="we-blocks__title">
          Оберіть блоки для сайту
        </h1>
        <p className="we-blocks__text">
          Оберіть що ви хочете показувати на вашому запрошенні
        </p>
      </div>

      <div className="we-blocks__list">
        <Block
          id="hero"
          label="Перший екран"
          open={open.hero}
          onToggleOpen={() => toggleOpen("hero")}
        >
          <div className="we-blocks__fields">
            <TextInput
              size="s"
              label="Імʼя нареченої"
              value={bride}
              onChange={(e) => onNamesChange(e.target.value, groom)}
            />
            <TextInput
              size="s"
              label="Імʼя нареченого"
              value={groom}
              onChange={(e) => onNamesChange(bride, e.target.value)}
            />
            <TextInput
              size="s"
              label="Дата"
              value={content.dateLabel}
              onChange={(e) => patch({ dateLabel: e.target.value })}
              placeholder="25.08.27"
              endAdornment={<IconCalendar />}
            />
          </div>
        </Block>

        <Block
          id="timer"
          label="Таймер"
          open={open.timer}
          onToggleOpen={() => toggleOpen("timer")}
          enabled={Boolean(content.timerEnabled)}
          onEnabledChange={(v) => patch({ timerEnabled: v })}
          toggleOnly
        />

        <Block
          id="schedule"
          label="Розклад"
          open={open.schedule}
          onToggleOpen={() => toggleOpen("schedule")}
          enabled={sections.schedule}
          onEnabledChange={(v) => patchSections({ schedule: v })}
        >
          {content.scheduleItems.map((item, index) => (
            <div key={`event-${index}`} className="we-blocks__event">
              <div className="we-blocks__event-head">
                <p className="we-blocks__event-title">Подія {index + 1}</p>
                <button
                  type="button"
                  className="we-trash"
                  aria-label={`Видалити подію ${index + 1}`}
                  onClick={() => removeEvent(index)}
                >
                  <IconTrash />
                </button>
              </div>
              <div className="we-blocks__event-grid">
                <TextInput
                  size="s"
                  label="Час"
                  value={item.time}
                  onChange={(e) => updateEvent(index, { time: e.target.value })}
                  placeholder="16:00"
                />
                <TextInput
                  size="s"
                  label="Подія"
                  value={item.title}
                  onChange={(e) =>
                    updateEvent(index, { title: e.target.value })
                  }
                  placeholder="Церемонія"
                />
                <TextInput
                  size="s"
                  label="Локація"
                  value={item.detail}
                  onChange={(e) =>
                    updateEvent(index, { detail: e.target.value })
                  }
                  placeholder="Адреса або локація"
                />
              </div>
            </div>
          ))}
          <button type="button" className="we-blocks__add" onClick={addEvent}>
            + Додати подію
          </button>
        </Block>

        <Block
          id="about"
          label="Про нас"
          open={open.about}
          onToggleOpen={() => toggleOpen("about")}
          enabled={sections.story}
          onEnabledChange={(v) => patchSections({ story: v })}
        >
          <div className="we-blocks__nested">
            <NestedItem
              label="Наша історія"
              checked={sections.story}
              onCheckedChange={(v) => patchSections({ story: v })}
            >
              <textarea
                className="we-blocks__textarea"
                value={content.storyBody}
                onChange={(e) => patch({ storyBody: e.target.value })}
                placeholder="Наприклад: Ми познайомились…"
              />
            </NestedItem>
            <NestedItem
              label="Про наречену"
              checked={content.subheadline.length > 0}
              onCheckedChange={(v) => {
                if (v) {
                  patch({
                    subheadline: content.subheadline.trim()
                      ? content.subheadline
                      : " ",
                  });
                } else {
                  patch({ subheadline: "" });
                }
              }}
            >
              <textarea
                className="we-blocks__textarea"
                value={content.subheadline.trim()}
                onChange={(e) => patch({ subheadline: e.target.value })}
                placeholder="Наприклад: трохи про наречену…"
              />
            </NestedItem>
            <NestedItem
              label="Про нареченого"
              checked={content.groomBio.length > 0}
              onCheckedChange={(v) => {
                if (v) {
                  patch({
                    groomBio: content.groomBio.trim() ? content.groomBio : " ",
                  });
                } else {
                  patch({ groomBio: "" });
                }
              }}
            >
              <textarea
                className="we-blocks__textarea"
                value={content.groomBio.trim()}
                onChange={(e) => patch({ groomBio: e.target.value })}
                placeholder="Наприклад: трохи про нареченого…"
              />
            </NestedItem>
            <NestedItem
              label="Пропозиція"
              checked={content.proposalBody.length > 0}
              onCheckedChange={(v) => {
                if (v) {
                  patch({
                    proposalBody: content.proposalBody.trim()
                      ? content.proposalBody
                      : " ",
                  });
                } else {
                  patch({ proposalBody: "" });
                }
              }}
            >
              <textarea
                className="we-blocks__textarea"
                value={content.proposalBody.trim()}
                onChange={(e) => patch({ proposalBody: e.target.value })}
                placeholder="Наприклад: як відбулася пропозиція…"
              />
            </NestedItem>
          </div>
        </Block>

        <Block
          id="details"
          label="Деталі весілля"
          open={open.details}
          onToggleOpen={() => toggleOpen("details")}
          enabled={detailsOn}
          onEnabledChange={setDetailsMaster}
        >
          <div className="we-blocks__nested">
            <NestedItem
              label="Що дарувати"
              checked={sections.registry}
              onCheckedChange={(v) => patchSections({ registry: v })}
            >
              <textarea
                className="we-blocks__textarea"
                value={content.registryBody}
                onChange={(e) => patch({ registryBody: e.target.value })}
                placeholder="Наприклад: не приносьте квіти…"
              />
            </NestedItem>
            <NestedItem
              label="Дрескод"
              checked={sections.dressCode}
              onCheckedChange={(v) => patchSections({ dressCode: v })}
            >
              <textarea
                className="we-blocks__textarea"
                value={content.dressCodeBody}
                onChange={(e) => patch({ dressCodeBody: e.target.value })}
                placeholder="Наприклад: приходьте в світлому"
              />
            </NestedItem>
            <NestedItem
              label="Контакти організаторів"
              checked={sections.travel}
              onCheckedChange={(v) => patchSections({ travel: v })}
            >
              <textarea
                className="we-blocks__textarea"
                value={content.travelBody}
                onChange={(e) => patch({ travelBody: e.target.value })}
                placeholder="Наприклад: телефон координатора…"
              />
            </NestedItem>
            <NestedItem
              label="Дитячі зони"
              checked={sections.gallery}
              onCheckedChange={(v) => patchSections({ gallery: v })}
            >
              <textarea
                className="we-blocks__textarea"
                value={content.galleryTitle}
                onChange={(e) => patch({ galleryTitle: e.target.value })}
                placeholder="Наприклад: буде няня та ігрова зона…"
              />
            </NestedItem>
            <NestedItem
              label="Коли треба дати відповідь"
              checked={sections.rsvp}
              onCheckedChange={(v) => patchSections({ rsvp: v })}
            >
              <textarea
                className="we-blocks__textarea"
                value={content.rsvpBody}
                onChange={(e) => patch({ rsvpBody: e.target.value })}
                placeholder="Наприклад: будь ласка, до 1 червня…"
              />
            </NestedItem>
            <NestedItem
              label="Інше"
              checked={sections.qa}
              onCheckedChange={(v) => patchSections({ qa: v })}
            >
              <textarea
                className="we-blocks__textarea"
                value={content.qaItems[0]?.answer ?? ""}
                onChange={(e) =>
                  patch({
                    qaItems: [
                      {
                        question: content.qaItems[0]?.question || "Інше",
                        answer: e.target.value,
                      },
                      ...content.qaItems.slice(1),
                    ],
                  })
                }
                placeholder="Наприклад: додаткові деталі…"
              />
            </NestedItem>
          </div>
        </Block>
      </div>
    </section>
  );
}

function NestedItem({
  label,
  checked,
  onCheckedChange,
  children,
}: {
  label: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  children?: ReactNode;
}) {
  return (
    <div className="we-blocks__nested-item">
      <div className="we-blocks__nested-row">
        <WebsiteToggle
          checked={checked}
          onChange={onCheckedChange}
          label={label}
        />
        <p className="we-blocks__nested-label">{label}</p>
      </div>
      {checked ? children : null}
    </div>
  );
}

function Block({
  id,
  label,
  open,
  onToggleOpen,
  enabled,
  onEnabledChange,
  toggleOnly,
  children,
}: {
  id: BlockId;
  label: string;
  open: boolean;
  onToggleOpen: () => void;
  enabled?: boolean;
  onEnabledChange?: (v: boolean) => void;
  toggleOnly?: boolean;
  children?: ReactNode;
}) {
  const hasToggle = typeof enabled === "boolean" && onEnabledChange;
  const canExpand = !toggleOnly;

  return (
    <div
      className={`we-blocks__block${open && canExpand ? " we-blocks__block--open" : ""}`}
      data-block={id}
    >
      <div className="we-blocks__row">
        {hasToggle ? (
          <WebsiteToggle
            checked={Boolean(enabled)}
            onChange={onEnabledChange}
            label={label}
          />
        ) : null}

        {canExpand ? (
          <button
            type="button"
            className="we-blocks__row-hit"
            onClick={onToggleOpen}
            aria-expanded={open}
          >
            <p className="we-blocks__label">{label}</p>
          </button>
        ) : (
          <p className="we-blocks__label">{label}</p>
        )}

        {canExpand ? (
          <button
            type="button"
            className="we-blocks__row-side"
            aria-expanded={open}
            aria-label={open ? "Згорнути" : "Розгорнути"}
            onClick={onToggleOpen}
          >
            <span
              className={`we-blocks__chevron${open ? " we-blocks__chevron--open" : ""}`}
            >
              <IconChevron />
            </span>
          </button>
        ) : null}
      </div>
      {open && canExpand && children ? (
        <div className="we-blocks__body">{children}</div>
      ) : null}
    </div>
  );
}
