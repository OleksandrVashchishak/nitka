"use client";

import { useCallback, useEffect, useState } from "react";
import {
  type AdminContactMessagesResponse,
  type AdminContactStatus,
  deleteAdminContactMessage,
  fetchAdminContactMessages,
  markAdminContactRead,
  replyAdminContact,
  setAdminContactStatus,
} from "@/lib/admin-api";
import { useAdminAuthStore } from "@/lib/admin-auth-store";
import "@/styles/admin/admin.scss";
import "@/styles/admin/admin-contact.scss";

const STATUS_OPTIONS: Array<{ value: AdminContactStatus; label: string }> = [
  { value: "NEW", label: "Нове" },
  { value: "IN_PROGRESS", label: "В роботі" },
  { value: "CLOSED", label: "Закрито" },
];

function fmtDate(value: string) {
  return new Date(value).toLocaleString("uk-UA");
}

export function AdminContactPage() {
  const accessToken = useAdminAuthStore((s) => s.accessToken);
  const [page, setPage] = useState(1);
  const [data, setData] = useState<AdminContactMessagesResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [replyId, setReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [notice, setNotice] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetchAdminContactMessages(accessToken, {
        page,
        limit: 50,
      });
      setData(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Помилка завантаження");
    } finally {
      setLoading(false);
    }
  }, [accessToken, page]);

  useEffect(() => {
    void load();
  }, [load]);

  async function onMarkRead(id: string) {
    if (!accessToken || busyId) return;
    setBusyId(id);
    try {
      await markAdminContactRead(accessToken, id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не вдалося позначити");
    } finally {
      setBusyId(null);
    }
  }

  async function onStatus(id: string, status: AdminContactStatus) {
    if (!accessToken || busyId) return;
    setBusyId(id);
    try {
      await setAdminContactStatus(accessToken, id, status);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не вдалося змінити статус");
    } finally {
      setBusyId(null);
    }
  }

  async function onReply(id: string) {
    if (!accessToken || busyId || !replyText.trim()) return;
    setBusyId(id);
    setNotice(null);
    try {
      const res = await replyAdminContact(accessToken, id, replyText.trim());
      setReplyId(null);
      setReplyText("");
      setNotice(
        res.dryRun
          ? "SMTP не налаштовано: лист не надіслано, відповідь збережено (див. логи API)."
          : "Лист надіслано.",
      );
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не вдалося надіслати");
    } finally {
      setBusyId(null);
    }
  }

  async function onDelete(id: string) {
    if (!accessToken || busyId) return;
    if (!window.confirm("Видалити це повідомлення?")) return;
    setBusyId(id);
    try {
      await deleteAdminContactMessage(accessToken, id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не вдалося видалити");
    } finally {
      setBusyId(null);
    }
  }

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.limit)) : 1;

  return (
    <div className="admin-contact">
      <h1 className="admin-page-title">Повідомлення</h1>
      <p className="admin-page-sub">
        Підтримка з кабінету та форма «Напишіть нам»
        {data ? ` · ${data.total} усього · ${data.unread} непрочитаних` : null}
      </p>

      {error ? <p className="admin-error">{error}</p> : null}
      {notice ? <p className="admin-muted">{notice}</p> : null}

      {loading && !data ? (
        <div className="admin-loader">Завантаження…</div>
      ) : null}

      {data && data.items.length === 0 ? (
        <p className="admin-muted">Поки немає жодного повідомлення.</p>
      ) : null}

      {data && data.items.length > 0 ? (
        <ul className="admin-contact-list">
          {data.items.map((item) => {
            const unread = !item.readAt;
            return (
              <li
                key={item.id}
                className={`admin-contact-card${unread ? " is-unread" : ""}`}
              >
                <div className="admin-contact-card__head">
                  <div>
                    <strong>{item.name}</strong>
                    <a href={`mailto:${item.email}`}>{item.email}</a>
                  </div>
                  <time dateTime={item.createdAt}>
                    {fmtDate(item.createdAt)}
                  </time>
                </div>
                <p className="admin-contact-card__body">{item.message}</p>
                {item.replyBody ? (
                  <div className="admin-contact-card__reply">
                    <span className="admin-muted">
                      Відповідь · {item.repliedAt ? fmtDate(item.repliedAt) : ""}
                    </span>
                    <p>{item.replyBody}</p>
                  </div>
                ) : null}
                <div className="admin-contact-card__actions">
                  <select
                    className="admin-contact-card__status"
                    value={item.status}
                    disabled={busyId === item.id}
                    onChange={(e) =>
                      void onStatus(item.id, e.target.value as AdminContactStatus)
                    }
                    aria-label="Статус"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                  {unread ? (
                    <button
                      type="button"
                      className="admin-btn admin-btn--ghost"
                      disabled={busyId === item.id}
                      onClick={() => void onMarkRead(item.id)}
                    >
                      Прочитано
                    </button>
                  ) : (
                    <span className="admin-muted">Прочитано</span>
                  )}
                  <button
                    type="button"
                    className="admin-btn admin-btn--ghost"
                    disabled={busyId === item.id}
                    onClick={() => {
                      setReplyId(replyId === item.id ? null : item.id);
                      setReplyText("");
                    }}
                  >
                    {item.replyBody ? "Відповісти ще" : "Відповісти"}
                  </button>
                  <button
                    type="button"
                    className="admin-btn admin-btn--ghost"
                    disabled={busyId === item.id}
                    onClick={() => void onDelete(item.id)}
                  >
                    Видалити
                  </button>
                </div>
                {replyId === item.id ? (
                  <form
                    className="admin-contact-card__form"
                    onSubmit={(e) => {
                      e.preventDefault();
                      void onReply(item.id);
                    }}
                  >
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder={`Відповідь для ${item.email}`}
                      rows={5}
                      maxLength={5000}
                    />
                    <button
                      type="submit"
                      className="admin-btn"
                      disabled={busyId === item.id || !replyText.trim()}
                    >
                      Надіслати на пошту
                    </button>
                  </form>
                ) : null}
              </li>
            );
          })}
        </ul>
      ) : null}

      {data && totalPages > 1 ? (
        <div className="admin-toolbar" style={{ marginTop: 16 }}>
          <button
            type="button"
            className="admin-btn admin-btn--ghost"
            disabled={page <= 1 || loading}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Назад
          </button>
          <span className="admin-muted">
            {page} / {totalPages}
          </span>
          <button
            type="button"
            className="admin-btn admin-btn--ghost"
            disabled={page >= totalPages || loading}
            onClick={() => setPage((p) => p + 1)}
          >
            Далі
          </button>
        </div>
      ) : null}
    </div>
  );
}
