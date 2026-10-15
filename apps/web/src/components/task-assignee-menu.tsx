"use client";

import { useEffect, useRef, useState } from "react";
import {
  CabinetContextMenuInput,
  CabinetContextMenuItem,
  CabinetContextMenuLabel,
} from "@/components/cabinet-context-menu";
import { ResponsibleAvatar } from "@/components/responsible-avatar";
import type { TaskAssignee } from "@/lib/dashboard-api";

type Props = {
  who: TaskAssignee;
  otherName?: string | null;
  ownerName: string;
  partnerName: string;
  onSelect: (assignee: TaskAssignee) => void;
  onSaveOtherName: (name: string) => void;
};

/** Assignee picker block for task context menus. */
export function TaskAssigneeMenuBlock({
  who,
  otherName,
  ownerName,
  partnerName,
  onSelect,
  onSaveOtherName,
}: Props) {
  const [draft, setDraft] = useState(otherName?.trim() ?? "");
  const [showOtherInput, setShowOtherInput] = useState(who === "other");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDraft(otherName?.trim() ?? "");
    setShowOtherInput(who === "other");
  }, [who, otherName]);

  useEffect(() => {
    if (!showOtherInput) return;
    const id = window.requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
    return () => window.cancelAnimationFrame(id);
  }, [showOtherInput]);

  function commitOtherName() {
    const next = draft.trim();
    const prev = otherName?.trim() ?? "";
    if (who === "other" && next === prev) return;
    onSaveOtherName(next);
  }

  return (
    <>
      <CabinetContextMenuLabel>Хто відповідальний:</CabinetContextMenuLabel>

      <CabinetContextMenuItem
        icon={<ResponsibleAvatar name={ownerName} tone="owner" />}
        active={who === "owner"}
        onClick={() => onSelect("owner")}
      >
        {ownerName}
      </CabinetContextMenuItem>
      <CabinetContextMenuItem
        icon={<ResponsibleAvatar name={partnerName} tone="partner" />}
        active={who === "partner"}
        onClick={() => onSelect("partner")}
      >
        {partnerName}
      </CabinetContextMenuItem>
      <CabinetContextMenuItem
        icon={
          <span className="cabinet-ctx-menu-avatars" aria-hidden>
            <ResponsibleAvatar name={partnerName} tone="partner" />
            <ResponsibleAvatar name={ownerName} tone="owner" />
          </span>
        }
        active={who === "both"}
        onClick={() => onSelect("both")}
      >
        Обоє
      </CabinetContextMenuItem>
      <CabinetContextMenuItem
        active={who === "none"}
        onClick={() => onSelect("none")}
      >
        Ніхто
      </CabinetContextMenuItem>
      <CabinetContextMenuItem
        active={who === "other"}
        onClick={() => {
          setShowOtherInput(true);
          if (who !== "other") onSelect("other");
        }}
      >
        Хтось інший
      </CabinetContextMenuItem>
      {showOtherInput ? (
        <CabinetContextMenuInput
          ref={inputRef}
          value={draft}
          placeholder="Напишіть відповідального"
          maxLength={80}
          aria-label="Імʼя відповідального"
          onChange={(e) => setDraft(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            e.stopPropagation();
            if (e.key === "Enter") {
              e.preventDefault();
              commitOtherName();
            }
          }}
          onBlur={(e) => {
            const next = e.relatedTarget;
            if (
              next instanceof Element &&
              next.closest(".cabinet-ctx-menu")
            ) {
              return;
            }
            commitOtherName();
          }}
        />
      ) : null}
    </>
  );
}
