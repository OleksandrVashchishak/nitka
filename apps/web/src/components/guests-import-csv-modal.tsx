"use client";

import { useRef, useState } from "react";
import { CabinetFormActions } from "@/components/cabinet-form-actions";
import { IconTrash } from "@/components/icon-trash";
import { CabinetOverlay } from "@/components/ui/cabinet-overlay";

const CSV_EXAMPLE = `name,phone,side
Олена Коваленко,+380501234567,BRIDE
Андрій Шевченко,,GROOM
Марія Бондаренко,+380671112233,BOTH`;

function isCsvFile(file: File) {
  const name = file.name.toLowerCase();
  return (
    name.endsWith(".csv") ||
    file.type === "text/csv" ||
    file.type === "application/vnd.ms-excel"
  );
}

function FileDocIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M14 3H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V9m-6-6 6 6m-6-6v5a1 1 0 0 0 1 1h5"
        stroke="#1A1A1A"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UploadArrowIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden>
      <g
        opacity="0.4"
        stroke="#1A1A1A"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M15 0v20" />
        <path d="M6.667 8.333 15 0l8.333 8.333" />
        <path d="M30 20v6.667A1.667 1.667 0 0 1 28.333 30H1.667A1.667 1.667 0 0 1 0 26.667V20" />
      </g>
    </svg>
  );
}

export function GuestsImportCsvModal({
  busy,
  onClose,
  onImport,
}: {
  busy?: boolean;
  onClose: () => void;
  onImport: (file: File) => boolean | Promise<boolean>;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [open, setOpen] = useState(true);

  function requestClose() {
    if (busy) return;
    setOpen(false);
    window.setTimeout(onClose, 280);
  }

  function pickFile(next: File | null | undefined) {
    if (!next) return;
    if (!isCsvFile(next)) return;
    setFile(next);
  }

  async function submit() {
    if (!file || busy) return;
    const ok = await onImport(file);
    if (!ok) return;
    setOpen(false);
    window.setTimeout(onClose, 280);
  }

  return (
    <CabinetOverlay
      open={open}
      onClose={requestClose}
      title="Імпорт"
      variant="modal"
      width={710}
      mobileVariant="fullscreen"
      closeDisabled={busy}
      panelClassName="cabinet-guests-import-modal"
      bodyClassName="cabinet-guests-import-modal-body"
      footerClassName="cabinet-modal-actions cabinet-guests-import-modal-actions"
      footer={
        <CabinetFormActions
          onCancel={requestClose}
          cancelDisabled={busy}
          saveLabel="Імпортувати"
          saveTone="black"
          saveType="button"
          onSave={() => void submit()}
          saveDisabled={!file || busy}
          saveLoading={busy}
          saveLoadingText="…"
        />
      }
    >
      <button
        type="button"
        className={`cabinet-guests-import-dropzone${
          dragging ? " is-dragging" : ""
        }`}
        onClick={() => fileRef.current?.click()}
        onDragEnter={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDragging(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          pickFile(e.dataTransfer.files?.[0]);
        }}
        disabled={busy}
      >
        <UploadArrowIcon />
        <span>Перетягніть файл сюди</span>
      </button>

      <input
        ref={fileRef}
        type="file"
        accept=".csv,text/csv"
        className="cabinet-guests-import-file-input"
        onChange={(e) => {
          pickFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />

      {file ? (
        <div className="cabinet-guests-import-file">
          <span className="cabinet-guests-import-file-icon" aria-hidden>
            <FileDocIcon />
          </span>
          <div className="cabinet-guests-import-file-meta">
            <p className="cabinet-guests-import-file-name">{file.name}</p>
            <p className="cabinet-guests-import-file-hint">CSV файл</p>
          </div>
          <button
            type="button"
            className="cabinet-guests-import-file-remove"
            aria-label="Прибрати файл"
            onClick={() => setFile(null)}
            disabled={busy}
          >
            <IconTrash size={18} />
          </button>
        </div>
      ) : null}

      <section className="cabinet-guests-import-format">
        <h3>Формат CSV</h3>
        <p>
          Перший рядок — заголовки. Далі по одному гостю в рядку. Роздільник —
          кома <code>,</code> або крапка з комою <code>;</code>.
        </p>
        <ul>
          <li>
            <code>name</code> — імʼя і прізвище (обовʼязково)
          </li>
          <li>
            <code>phone</code> — телефон (необовʼязково)
          </li>
          <li>
            <code>side</code> — чиї гості: <code>BRIDE</code>,{" "}
            <code>GROOM</code> або <code>BOTH</code>. Якщо порожньо —{" "}
            <code>BOTH</code>
          </li>
        </ul>
        <pre className="cabinet-guests-import-example">{CSV_EXAMPLE}</pre>
      </section>
    </CabinetOverlay>
  );
}
