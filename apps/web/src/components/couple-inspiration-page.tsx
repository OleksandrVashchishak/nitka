"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  Suspense,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { CabinetPageHeader } from "@/components/cabinet-page-header";
import { CabinetFormActions } from "@/components/cabinet-form-actions";
import { useMenuOutsideClose } from "@/hooks/use-menu-outside-close";
import {
  CabinetContextMenu,
  CabinetContextMenuItem,
  CabinetActionItem,
} from "@/components/cabinet-context-menu";
import { IconClose } from "@/components/icon-close";
import {
  IconBackArrow,
  IconInspirationFab,
  IconPlus,
  IconShareNodes,
} from "@/components/inspiration-icons";
import { IconDayPlanBack, IconDayPlanPlus } from "@/components/day-plan/day-plan-icons";
import { IconEdit } from "@/components/icon-edit";
import { IconMore } from "@/components/icon-more";
import { IconTrash } from "@/components/icon-trash";
import { DeleteConfirmModal } from "@/components/delete-confirm-modal";
import { RequireAuth } from "@/components/require-auth";
import { Button } from "@/components/ui/button";
import { CabinetOverlay } from "@/components/ui/cabinet-overlay";
import { Select } from "@/components/ui/select";
import { TextInput } from "@/components/ui/text-input";
import { PageLoader } from "@/components/ui-loader";
import { useAuthStore } from "@/lib/auth-store";
import { uploadFile } from "@/lib/client-api";
import { getMyWedding } from "@/lib/dashboard-api";
import {
  imageCountLabel,
  inspirationTileAspect,
  loadInspirationBoards,
  saveInspirationBoards,
  type InspirationBoard,
} from "@/lib/inspiration-boards";
import {
  getNotificationsSummary,
  type NotificationsSummary,
} from "@/lib/notifications-api";
import { getErrorMessage, toast } from "@/lib/toast";
import "@/styles/cabinet/cabinet.scss";
import "@/styles/cabinet/inspiration.scss";

const TILE_SLOTS = ["tl", "tr", "bl", "br"] as const;

function newBoardId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `board-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function BoardCollage({ images }: { images: string[] }) {
  function tile(slot: (typeof TILE_SLOTS)[number], src: string | undefined) {
    if (src) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className={`cabinet-inspiration-tile cabinet-inspiration-tile--${slot}`}
          src={src}
          alt=""
        />
      );
    }
    return (
      <span
        className={`cabinet-inspiration-tile cabinet-inspiration-tile--${slot} is-empty`}
      />
    );
  }

  return (
    <div className="cabinet-inspiration-collage" aria-hidden>
      <div className="cabinet-inspiration-collage-col">
        {tile("tl", images[0])}
        {tile("bl", images[2])}
      </div>
      <div className="cabinet-inspiration-collage-col">
        {tile("tr", images[1])}
        {tile("br", images[3])}
      </div>
    </div>
  );
}

function BoardNameModal({
  mode,
  initialTitle,
  onClose,
  onSave,
}: {
  mode: "create" | "rename";
  initialTitle: string;
  onClose: () => void;
  onSave: (title: string) => void;
}) {
  const [title, setTitle] = useState(initialTitle);
  const [open, setOpen] = useState(true);

  function requestClose() {
    setOpen(false);
    window.setTimeout(onClose, 280);
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    const next = title.trim();
    if (!next) return;
    onSave(next);
  }

  return (
    <CabinetOverlay
      open={open}
      onClose={requestClose}
      title={mode === "rename" ? "Перейменувати дошку" : "Додати дошку"}
      variant="modal"
      width={480}
      mobileVariant="fullscreen"
      panelClassName="cabinet-inspiration-modal cabinet-inspiration-modal--name"
      bodyClassName="cabinet-inspiration-modal-body"
      footerClassName="cabinet-modal-actions cabinet-inspiration-modal-actions"
      asForm
      onSubmit={submit}
      footer={
        <CabinetFormActions onCancel={requestClose} saveTone="black" />
      }
    >
      <TextInput
        label="Назва дошки"
        size="m"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Наприклад: Церемонія"
        required
        autoFocus
      />
    </CabinetOverlay>
  );
}

type PendingImage = {
  id: string;
  file: File;
  previewUrl: string;
};

function AddImagesModal({
  boards,
  initialBoardId,
  onClose,
  onSave,
}: {
  boards: InspirationBoard[];
  initialBoardId: string;
  onClose: () => void;
  onSave: (boardId: string, urls: string[]) => void | Promise<void>;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [boardId, setBoardId] = useState(initialBoardId);
  const [pending, setPending] = useState<PendingImage[]>([]);
  const [saving, setSaving] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [open, setOpen] = useState(true);

  function requestClose() {
    if (saving) return;
    setOpen(false);
    window.setTimeout(onClose, 280);
  }

  useEffect(() => {
    return () => {
      for (const item of pending) URL.revokeObjectURL(item.previewUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- revoke only on unmount
  }, []);

  function addFiles(fileList: FileList | File[] | null) {
    if (!fileList) return;
    const files = Array.from(fileList).filter((f) =>
      f.type.startsWith("image/"),
    );
    if (!files.length) return;
    setPending((prev) => [
      ...prev,
      ...files.map((file) => ({
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        file,
        previewUrl: URL.createObjectURL(file),
      })),
    ]);
  }

  function removePending(id: string) {
    setPending((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((p) => p.id !== id);
    });
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!boardId || !pending.length || saving) return;
    setSaving(true);
    try {
      const urls: string[] = [];
      for (const item of pending) {
        const res = await uploadFile(item.file);
        urls.push(res.url);
      }
      await onSave(boardId, urls);
      for (const item of pending) URL.revokeObjectURL(item.previewUrl);
      setPending([]);
    } catch (err) {
      toast.error("Не вдалось завантажити", getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <CabinetOverlay
      open={open}
      onClose={requestClose}
      title="Додати зображення"
      variant="modal"
      width={560}
      mobileVariant="fullscreen"
      closeDisabled={saving}
      panelClassName="cabinet-inspiration-modal cabinet-inspiration-modal--add"
      bodyClassName="cabinet-inspiration-modal-body"
      footerClassName="cabinet-modal-actions cabinet-inspiration-modal-actions"
      asForm
      onSubmit={(e) => void submit(e)}
      footer={
        <CabinetFormActions
          onCancel={requestClose}
          cancelDisabled={saving}
          saveTone="black"
          saveLoading={saving}
          saveLoadingText="Зберігаємо…"
          saveDisabled={!pending.length}
        />
      }
    >
      <Select
        label="Дошка"
        size="m"
        value={boardId}
        onChange={(e) => setBoardId(e.target.value)}
        required
      >
        {boards.map((b) => (
          <option key={b.id} value={b.id}>
            {b.title}
          </option>
        ))}
      </Select>

      <button
        type="button"
        className={`cabinet-inspiration-dropzone${dragging ? " is-dragging" : ""}`}
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
          addFiles(e.dataTransfer.files);
        }}
        disabled={saving}
      >
        Завантажити фото
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        className="cabinet-inspiration-file-input"
        onChange={(e) => {
          addFiles(e.target.files);
          e.target.value = "";
        }}
      />

      {pending.length ? (
        <ul className="cabinet-inspiration-pending">
          {pending.map((item) => (
            <li key={item.id} className="cabinet-inspiration-pending-item">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.previewUrl} alt="" />
              <span className="cabinet-inspiration-pending-name">
                {item.file.name}
              </span>
              <button
                type="button"
                className="cabinet-inspiration-pending-remove"
                aria-label="Прибрати"
                onClick={() => removePending(item.id)}
                disabled={saving}
              >
                <IconClose
                  size={12}
                  className="cabinet-inspiration-pending-x"
                />
                <IconTrash
                  size={18}
                  className="cabinet-inspiration-pending-trash"
                />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </CabinetOverlay>
  );
}

function useInspirationSession() {
  const user = useAuthStore((s) => s.user);
  const [loading, setLoading] = useState(true);
  const [weddingId, setWeddingId] = useState<string | null>(null);
  const [boards, setBoards] = useState<InspirationBoard[]>([]);
  const [summary, setSummary] = useState<NotificationsSummary | null>(null);
  const [partnerInitials, setPartnerInitials] = useState("П");

  useEffect(() => {
    void (async () => {
      try {
        const wedding = await getMyWedding();
        if (!wedding) {
          setWeddingId(null);
          setBoards([]);
          return;
        }
        setWeddingId(wedding.id);
        setBoards(loadInspirationBoards(wedding.id));

        const oneRaw =
          wedding.partnerOneName?.trim() || user?.name?.trim() || "";
        const twoRaw = wedding.partnerTwoName?.trim() || "";
        const one = oneRaw.charAt(0).toUpperCase() || "П";
        const two = twoRaw.charAt(0).toUpperCase();
        setPartnerInitials(two ? `${one}&${two}` : one);
      } catch {
        setWeddingId(null);
        setBoards([]);
      } finally {
        setLoading(false);
      }
    })();

    void getNotificationsSummary()
      .then(setSummary)
      .catch(() => setSummary(null));
  }, [user?.name]);

  function persist(next: InspirationBoard[]) {
    setBoards(next);
    if (weddingId) saveInspirationBoards(weddingId, next);
  }

  return {
    loading,
    weddingId,
    boards,
    setBoards,
    summary,
    partnerInitials,
    persist,
  };
}

function InspirationListInner() {
  const router = useRouter();
  const { loading, boards, summary, partnerInitials, persist } =
    useInspirationSession();
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [nameModal, setNameModal] = useState<"create" | "rename" | null>(null);
  const [renaming, setRenaming] = useState<InspirationBoard | null>(null);
  const [addBoardId, setAddBoardId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<InspirationBoard | null>(
    null,
  );

  useMenuOutsideClose(
    Boolean(menuOpenId),
    () => setMenuOpenId(null),
    ".cabinet-inspiration-menu-wrap",
  );

  function openCreate() {
    setMenuOpenId(null);
    setRenaming(null);
    setNameModal("create");
  }

  function openRename(board: InspirationBoard) {
    setMenuOpenId(null);
    setRenaming(board);
    setNameModal("rename");
  }

  function onSaveName(title: string) {
    if (nameModal === "rename" && renaming) {
      persist(
        boards.map((b) => (b.id === renaming.id ? { ...b, title } : b)),
      );
      toast.success("Перейменовано", `Тепер це «${title}»`);
    } else {
      persist([
        ...boards,
        {
          id: newBoardId(),
          title,
          images: [],
        },
      ]);
      toast.success("Додано", `Дошку «${title}» створено`);
    }
    setNameModal(null);
    setRenaming(null);
  }

  function onSaveImages(targetBoardId: string, urls: string[]) {
    persist(
      boards.map((b) =>
        b.id === targetBoardId
          ? { ...b, images: [...b.images, ...urls] }
          : b,
      ),
    );
    toast.success(
      "Додано",
      urls.length === 1
        ? "Зображення на дошці"
        : `${urls.length} зображень на дошці`,
    );
    setAddBoardId(null);
    router.push(`/inspiration/${targetBoardId}`);
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    persist(boards.filter((b) => b.id !== deleteTarget.id));
    toast.success("Видалено", `«${deleteTarget.title}» прибрано`);
    setDeleteTarget(null);
  }

  function onBack() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }
    router.push("/dashboard");
  }

  if (loading) {
    return <PageLoader label="Завантажуємо дошки…" />;
  }

  const addBtn = (className?: string) => (
    <Button
      type="button"
      tone="ghost"
      size="m"
      className={["cabinet-inspiration-add-btn", className]
        .filter(Boolean)
        .join(" ")}
      onClick={openCreate}
    >
      <IconPlus />
      Додати дошку
    </Button>
  );

  return (
    <div className="cabinet-tasks-page cabinet-inspiration-page">
      <div className="cabinet-inspiration-desktop-top">
        <CabinetPageHeader
          title="Дошка натхнення"
          summary={summary}
          initials={partnerInitials}
        />
        <div className="cabinet-inspiration-toolbar">{addBtn()}</div>
      </div>

      <div className="cabinet-inspiration-mobile-top">
        <button
          type="button"
          className="cabinet-inspiration-mobile-back"
          aria-label="Назад"
          onClick={onBack}
        >
          <IconDayPlanBack />
        </button>
        <h1 className="cabinet-inspiration-mobile-title">Дошка натхнення</h1>
      </div>

      <div className="cabinet-inspiration-grid">
        {boards.map((board) => {
          const empty = board.images.length === 0;
          return (
            <article key={board.id} className="cabinet-inspiration-card">
              {empty ? (
                <button
                  type="button"
                  className="cabinet-inspiration-upload"
                  onClick={() => {
                    setMenuOpenId(null);
                    setAddBoardId(board.id);
                  }}
                >
                  Завантажити фото
                </button>
              ) : (
                <Link
                  href={`/inspiration/${board.id}`}
                  className="cabinet-inspiration-card-link"
                >
                  <BoardCollage images={board.images} />
                </Link>
              )}
              <div className="cabinet-inspiration-meta">
                <Link
                  href={`/inspiration/${board.id}`}
                  className="cabinet-inspiration-meta-text"
                >
                  <h2 className="cabinet-inspiration-card-title">
                    {board.title}
                  </h2>
                  {!empty ? (
                    <p className="cabinet-inspiration-card-count">
                      {imageCountLabel(board.images.length)}
                    </p>
                  ) : null}
                </Link>
                <div className="cabinet-ctx-menu-wrap cabinet-inspiration-menu-wrap">
                  <button
                    type="button"
                    className="cabinet-inspiration-menu-btn"
                    aria-label={`Меню дошки «${board.title}»`}
                    aria-expanded={menuOpenId === board.id}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setMenuOpenId((id) =>
                        id === board.id ? null : board.id,
                      );
                    }}
                  >
                    <IconMore />
                  </button>
                  {menuOpenId === board.id ? (
                    <CabinetContextMenu>
                      <CabinetContextMenuItem
                        icon={<IconEdit />}
                        onClick={() => openRename(board)}
                      >
                        Перейменувати
                      </CabinetContextMenuItem>
                      <CabinetContextMenuItem
                        icon={<IconTrash />}
                        danger
                        onClick={() => {
                          setMenuOpenId(null);
                          setDeleteTarget(board);
                        }}
                      >
                        Видалити
                      </CabinetContextMenuItem>
                    </CabinetContextMenu>
                  ) : null}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="cabinet-inspiration-mobile-bar">
        {addBtn("cabinet-inspiration-mobile-add")}
      </div>

      {nameModal ? (
        <BoardNameModal
          mode={nameModal}
          initialTitle={renaming?.title ?? ""}
          onClose={() => {
            setNameModal(null);
            setRenaming(null);
          }}
          onSave={onSaveName}
        />
      ) : null}

      {addBoardId ? (
        <AddImagesModal
          boards={boards}
          initialBoardId={addBoardId}
          onClose={() => setAddBoardId(null)}
          onSave={onSaveImages}
        />
      ) : null}

      <DeleteConfirmModal
        open={Boolean(deleteTarget)}
        title="Видалити дошку"
        description={
          deleteTarget
            ? `Ви впевнені, що хочете видалити «${deleteTarget.title}»?`
            : "Ви впевнені, що хочете видалити цю дошку?"
        }
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

function InspirationBoardInner() {
  const params = useParams<{ boardId: string }>();
  const boardId = params.boardId;
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loading, boards, summary, partnerInitials, persist } =
    useInspirationSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [nameModal, setNameModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletePhotoOpen, setDeletePhotoOpen] = useState(false);

  const board = boards.find((b) => b.id === boardId) ?? null;
  const photoRaw = searchParams.get("photo");
  const photoIndex =
    photoRaw != null && photoRaw !== ""
      ? Number.parseInt(photoRaw, 10)
      : null;
  const photoOpen =
    board != null &&
    photoIndex != null &&
    Number.isFinite(photoIndex) &&
    photoIndex >= 0 &&
    photoIndex < board.images.length;

  useMenuOutsideClose(menuOpen, () => setMenuOpen(false), ".cabinet-inspiration-menu-wrap");

  useEffect(() => {
    if (loading) return;
    if (!board) router.replace("/inspiration");
  }, [loading, board, router]);

  useEffect(() => {
    if (loading || !board || photoRaw == null) return;
    if (!photoOpen) {
      router.replace(`/inspiration/${board.id}`);
    }
  }, [loading, board, photoRaw, photoOpen, router]);

  function updateBoard(next: InspirationBoard) {
    persist(boards.map((b) => (b.id === next.id ? next : b)));
  }

  function openPhoto(index: number) {
    if (!board) return;
    router.push(`/inspiration/${board.id}?photo=${index}`);
  }

  function closePhoto() {
    if (!board) return;
    router.push(`/inspiration/${board.id}`);
  }

  function onRename(title: string) {
    if (!board) return;
    updateBoard({ ...board, title });
    toast.success("Перейменовано", `Тепер це «${title}»`);
    setNameModal(false);
  }

  function confirmDeleteBoard() {
    if (!board) return;
    persist(boards.filter((b) => b.id !== board.id));
    toast.success("Видалено", `«${board.title}» прибрано`);
    setDeleteOpen(false);
    router.push("/inspiration");
  }

  async function onSharePhoto() {
    if (!board || !photoOpen || photoIndex == null) return;
    const url = board.images[photoIndex];
    if (!url) return;
    const absolute =
      url.startsWith("http://") || url.startsWith("https://")
        ? url
        : `${window.location.origin}${url.startsWith("/") ? "" : "/"}${url}`;
    try {
      await navigator.clipboard.writeText(absolute);
      toast.success("Скопійовано", "Посилання на зображення в буфері");
    } catch {
      toast.error("Не вдалося скопіювати посилання");
    }
  }

  function confirmDeletePhoto() {
    if (!board || photoIndex == null || !photoOpen) return;
    const nextImages = board.images.filter((_, i) => i !== photoIndex);
    updateBoard({ ...board, images: nextImages });
    toast.success("Видалено", "Зображення прибрано з дошки");
    setDeletePhotoOpen(false);
    if (!nextImages.length) {
      router.push(`/inspiration/${board.id}`);
      return;
    }
    const nextIndex = Math.min(photoIndex, nextImages.length - 1);
    router.replace(`/inspiration/${board.id}?photo=${nextIndex}`);
  }

  function onSaveImages(targetBoardId: string, urls: string[]) {
    const target = boards.find((b) => b.id === targetBoardId);
    if (!target) return;
    persist(
      boards.map((b) =>
        b.id === targetBoardId
          ? { ...b, images: [...b.images, ...urls] }
          : b,
      ),
    );
    toast.success(
      "Додано",
      urls.length === 1
        ? "Зображення на дошці"
        : `${urls.length} зображень на дошці`,
    );
    setAddModal(false);
    if (targetBoardId !== board?.id) {
      router.push(`/inspiration/${targetBoardId}`);
    }
  }

  if (loading || !board) {
    return <PageLoader label="Завантажуємо дошку…" />;
  }

  if (photoOpen && photoIndex != null) {
    const currentSrc = board.images[photoIndex];

    return (
      <div className="cabinet-tasks-page cabinet-inspiration-page cabinet-inspiration-viewer-page">
        <div className="cabinet-inspiration-desktop-chrome">
          <CabinetPageHeader
            title="Дошка натхнення"
            summary={summary}
            initials={partnerInitials}
          />
        </div>

        <button
          type="button"
          className="cabinet-inspiration-back"
          onClick={closePhoto}
        >
          <IconBackArrow />
          Назад
        </button>

        <div className="cabinet-inspiration-viewer">
          <div className="cabinet-inspiration-viewer-main">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="cabinet-inspiration-viewer-hero"
              src={currentSrc}
              alt=""
            />
            <div className="cabinet-inspiration-viewer-actions">
              <button
                type="button"
                className="cabinet-inspiration-viewer-action"
                onClick={() => void onSharePhoto()}
              >
                <IconShareNodes />
                Поширити
              </button>
              <CabinetActionItem
                danger
                icon={<IconTrash size={18} />}
                className="cabinet-inspiration-viewer-action"
                onClick={() => setDeletePhotoOpen(true)}
              >
                Видалити
              </CabinetActionItem>
            </div>
          </div>

          <div className="cabinet-inspiration-viewer-thumbs" role="list">
            {board.images.map((src, index) => (
              <button
                key={`${src}-${index}`}
                type="button"
                role="listitem"
                className={`cabinet-inspiration-viewer-thumb${
                  index === photoIndex ? " is-active" : ""
                }`}
                aria-label={`Зображення ${index + 1}`}
                aria-current={index === photoIndex ? "true" : undefined}
                onClick={() => openPhoto(index)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" />
              </button>
            ))}
          </div>
        </div>

        <DeleteConfirmModal
          open={deletePhotoOpen}
          title="Видалити зображення"
          description="Ви впевнені, що хочете видалити це зображення з дошки?"
          onClose={() => setDeletePhotoOpen(false)}
          onConfirm={confirmDeletePhoto}
        />
      </div>
    );
  }

  return (
    <div className="cabinet-tasks-page cabinet-inspiration-page cabinet-inspiration-board-page">
      <div className="cabinet-inspiration-desktop-chrome">
        <CabinetPageHeader
          title="Дошка натхнення"
          summary={summary}
          initials={partnerInitials}
        />

        <Link href="/inspiration" className="cabinet-inspiration-back">
          <IconBackArrow />
          Назад
        </Link>

        <div className="cabinet-inspiration-board-head">
          <h2 className="cabinet-inspiration-board-title">{board.title}</h2>
          <div className="cabinet-inspiration-board-actions">
            <Button
              type="button"
              tone="black"
              size="m"
              className="cabinet-inspiration-add-image-btn"
              onClick={() => setAddModal(true)}
            >
              <IconDayPlanPlus />
              Додати зображення
            </Button>
            <div className="cabinet-ctx-menu-wrap cabinet-inspiration-menu-wrap">
              <button
                type="button"
                className="cabinet-inspiration-menu-btn"
                aria-label={`Меню дошки «${board.title}»`}
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((open) => !open)}
              >
                <IconMore />
              </button>
              {menuOpen ? (
                <CabinetContextMenu>
                  <CabinetContextMenuItem
                    icon={<IconEdit />}
                    onClick={() => {
                      setMenuOpen(false);
                      setNameModal(true);
                    }}
                  >
                    Перейменувати
                  </CabinetContextMenuItem>
                  <CabinetContextMenuItem
                    icon={<IconTrash />}
                    danger
                    onClick={() => {
                      setMenuOpen(false);
                      setDeleteOpen(true);
                    }}
                  >
                    Видалити
                  </CabinetContextMenuItem>
                </CabinetContextMenu>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="cabinet-inspiration-board-mobile-top">
        <button
          type="button"
          className="cabinet-inspiration-mobile-back"
          aria-label="Назад"
          onClick={() => router.push("/inspiration")}
        >
          <IconDayPlanBack />
        </button>
        <h1 className="cabinet-inspiration-board-mobile-title">{board.title}</h1>
        <button
          type="button"
          className="cabinet-inspiration-fab-btn"
          aria-label="Додати зображення"
          onClick={() => setAddModal(true)}
        >
          <IconInspirationFab />
        </button>
        <div className="cabinet-ctx-menu-wrap cabinet-inspiration-menu-wrap">
          <button
            type="button"
            className="cabinet-inspiration-menu-btn"
            aria-label={`Меню дошки «${board.title}»`}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <IconMore />
          </button>
          {menuOpen ? (
            <CabinetContextMenu>
              <CabinetContextMenuItem
                icon={<IconEdit />}
                onClick={() => {
                  setMenuOpen(false);
                  setNameModal(true);
                }}
              >
                Перейменувати
              </CabinetContextMenuItem>
              <CabinetContextMenuItem
                icon={<IconTrash />}
                danger
                onClick={() => {
                  setMenuOpen(false);
                  setDeleteOpen(true);
                }}
              >
                Видалити
              </CabinetContextMenuItem>
            </CabinetContextMenu>
          ) : null}
        </div>
      </div>

      {board.images.length ? (
        <div className="cabinet-inspiration-photos">
          {board.images.map((src, index) => (
            <button
              key={`${src}-${index}`}
              type="button"
              className="cabinet-inspiration-photo-btn"
              onClick={() => openPhoto(index)}
              aria-label={`Відкрити зображення ${index + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="cabinet-inspiration-photo"
                src={src}
                alt=""
                style={{ aspectRatio: String(inspirationTileAspect(index)) }}
              />
            </button>
          ))}
        </div>
      ) : (
        <p className="cabinet-inspiration-photos-empty">
          Поки немає зображень — додай перше.
        </p>
      )}

      {nameModal ? (
        <BoardNameModal
          mode="rename"
          initialTitle={board.title}
          onClose={() => setNameModal(false)}
          onSave={onRename}
        />
      ) : null}

      {addModal ? (
        <AddImagesModal
          boards={boards}
          initialBoardId={board.id}
          onClose={() => setAddModal(false)}
          onSave={onSaveImages}
        />
      ) : null}

      <DeleteConfirmModal
        open={deleteOpen}
        title="Видалити дошку"
        description={`Ви впевнені, що хочете видалити «${board.title}»?`}
        onClose={() => setDeleteOpen(false)}
        onConfirm={confirmDeleteBoard}
      />
    </div>
  );
}

export function CoupleInspirationPage() {
  return (
    <RequireAuth roles={["COUPLE"]}>
      <InspirationListInner />
    </RequireAuth>
  );
}

export function CoupleInspirationBoardPage() {
  return (
    <RequireAuth roles={["COUPLE"]}>
      <Suspense fallback={<PageLoader label="Завантажуємо дошку…" />}>
        <InspirationBoardInner />
      </Suspense>
    </RequireAuth>
  );
}
