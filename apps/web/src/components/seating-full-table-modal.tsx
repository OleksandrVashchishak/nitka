"use client";

import { useEffect, useState } from "react";
import { CabinetFormActions } from "@/components/cabinet-form-actions";
import { CabinetOverlay } from "@/components/ui/cabinet-overlay";
import { Radio, RadioGroup, RadioOption } from "@/components/ui/radio";
import { IconChevronDown } from "@/components/website/website-icons";
import { detectUaNameGender, uaFullNameAccusative } from "@/lib/ua-name-case";

export type SeatingFullTableOccupant = { key: string; name: string };

type Props = {
  open: boolean;
  /** Номер / назва столу для заголовка («3»). */
  tableNo: string;
  guestName: string;
  /** Хто сидить за столом — кандидати на «замість». */
  occupants: SeatingFullTableOccupant[];
  onClose: () => void;
  /** Посадити гостя замість `occupantKey`. */
  onReplace: (occupantKey: string) => void;
};

type Choice = "replace" | "skip" | null;

/** «За столом N більше немає місця» — коли гостя кидають на повний стіл. */
export function SeatingFullTableModal({
  open,
  tableNo,
  guestName,
  occupants,
  onClose,
  onReplace,
}: Props) {
  const [choice, setChoice] = useState<Choice>("replace");
  const [occupantKey, setOccupantKey] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    // На мобілці (bottom sheet) нічого не обрано наперед — як у макеті.
    setChoice(
      window.matchMedia("(max-width: 767px)").matches ? null : "replace",
    );
    setOccupantKey(null);
  }, [open, guestName, tableNo]);

  const firstName = guestName.trim().split(/\s+/)[0] ?? "";
  const pronoun = detectUaNameGender(firstName) === "feminine" ? "її" : "його";
  const canSave = choice === "skip" || occupantKey !== null;

  function save() {
    if (choice === "skip") {
      onClose();
      return;
    }
    if (occupantKey) onReplace(occupantKey);
  }

  return (
    <CabinetOverlay
      open={open}
      onClose={onClose}
      title={`За столом ${tableNo} більше немає місця. Що робимо?`}
      variant="modal"
      width={710}
      mobileVariant="sheet"
      panelClassName="seat-full-table-modal seat-conflict-sheet"
      bodyClassName="seat-full-table-modal-body"
      footerClassName="cabinet-modal-actions seat-full-table-modal-actions"
      footer={
        <CabinetFormActions
          onCancel={onClose}
          saveType="button"
          onSave={save}
          saveDisabled={!canSave}
        />
      }
    >
      <RadioGroup className="seat-full-table-modal-options seat-conflict-sheet__options">
        <div
          className={`seat-full-table-modal-replace seat-conflict-sheet__expand${
            choice === "replace" ? " is-selected" : ""
          }`}
        >
          <RadioOption
            selected={choice === "replace"}
            onSelect={() => setChoice("replace")}
          >
            <span>Садимо {uaFullNameAccusative(guestName)} замість когось</span>
            <span className="seat-conflict-sheet__chevron">
              <IconChevronDown />
            </span>
          </RadioOption>
          {choice === "replace" ? (
            <div
              role="radiogroup"
              aria-label="Замість кого"
              className="seat-full-table-modal-occupants"
            >
              {occupants.map((o) => (
                <button
                  key={o.key}
                  type="button"
                  role="radio"
                  aria-checked={occupantKey === o.key}
                  className={`seat-full-table-modal-occupant${
                    occupantKey === o.key ? " is-selected" : ""
                  }`}
                  onClick={() => setOccupantKey(o.key)}
                >
                  <Radio checked={occupantKey === o.key} />
                  <span>{o.name}</span>
                </button>
              ))}
            </div>
          ) : null}
        </div>
        <RadioOption
          selected={choice === "skip"}
          onSelect={() => setChoice("skip")}
        >
          Не садимо {pronoun} за цей стіл
        </RadioOption>
      </RadioGroup>
    </CabinetOverlay>
  );
}
