"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import {
  type AdminNote,
  type AdminUserDetail,
  createAdminNote,
  deleteAdminNote,
  fetchAdminUser,
} from "@/lib/admin-api";
import { useAdminAuthStore } from "@/lib/admin-auth-store";
import "@/styles/admin/admin.scss";
import "@/styles/admin/admin-users.scss";

function fmtDate(value: string | null | undefined) {
  if (!value) return "—";
  return new Date(value).toLocaleString("uk-UA");
}

function fmtMoney(n: number) {
  return new Intl.NumberFormat("uk-UA").format(n);
}

export function AdminUserDetailPage({ userId }: { userId: string }) {
  const accessToken = useAdminAuthStore((s) => s.accessToken);
  const [user, setUser] = useState<AdminUserDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [noteBody, setNoteBody] = useState("");
  const [notePending, setNotePending] = useState(false);
  const [noteError, setNoteError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    let cancelled = false;
    fetchAdminUser(accessToken, userId)
      .then((data) => {
        if (!cancelled) setUser(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Помилка");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [accessToken, userId]);

  async function onAddNote(e: FormEvent) {
    e.preventDefault();
    if (!accessToken || !noteBody.trim()) return;
    setNotePending(true);
    setNoteError(null);
    try {
      const note = await createAdminNote(accessToken, userId, noteBody.trim());
      setUser((prev) =>
        prev ? { ...prev, notes: [note, ...prev.notes] } : prev,
      );
      setNoteBody("");
    } catch (err) {
      setNoteError(err instanceof Error ? err.message : "Не вдалося зберегти");
    } finally {
      setNotePending(false);
    }
  }

  async function onDeleteNote(note: AdminNote) {
    if (!accessToken) return;
    if (!window.confirm("Видалити нотатку?")) return;
    try {
      await deleteAdminNote(accessToken, userId, note.id);
      setUser((prev) =>
        prev
          ? { ...prev, notes: prev.notes.filter((n) => n.id !== note.id) }
          : prev,
      );
    } catch (err) {
      setNoteError(err instanceof Error ? err.message : "Не вдалося видалити");
    }
  }

  if (error) {
    return (
      <>
        <Link href="/admin/users" className="admin-back">
          ← До юзерів
        </Link>
        <p className="admin-error">{error}</p>
      </>
    );
  }

  if (!user) {
    return <div className="admin-loader">Завантаження…</div>;
  }

  const w = user.wedding;

  return (
    <>
      <Link href="/admin/users" className="admin-back">
        ← До юзерів
      </Link>
      <h1 className="admin-page-title">{user.email}</h1>
      <p className="admin-page-sub">{user.name}</p>

      <div className="admin-detail-grid">
        <section className="admin-detail-card admin-detail-card--wide">
          <h2>Нотатки адміна</h2>
          <form className="admin-note-form" onSubmit={onAddNote}>
            <textarea
              value={noteBody}
              onChange={(e) => setNoteBody(e.target.value)}
              placeholder="Support context, дзвінок, баг, follow-up…"
              rows={3}
              maxLength={4000}
              required
            />
            <button
              className="admin-btn"
              type="submit"
              disabled={notePending || !noteBody.trim()}
            >
              {notePending ? "Збереження…" : "Додати"}
            </button>
          </form>
          {noteError ? <p className="admin-error">{noteError}</p> : null}
          {user.notes.length === 0 ? (
            <p className="admin-muted" style={{ margin: "12px 0 0", fontSize: 13 }}>
              Поки порожньо
            </p>
          ) : (
            <ul className="admin-notes">
              {user.notes.map((n) => (
                <li key={n.id} className="admin-notes__item">
                  <div className="admin-notes__meta">
                    <span>{fmtDate(n.createdAt)}</span>
                    <button
                      type="button"
                      className="admin-notes__delete"
                      onClick={() => void onDeleteNote(n)}
                    >
                      видалити
                    </button>
                  </div>
                  <p>{n.body}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="admin-detail-card">
          <h2>Профіль</h2>
          <dl className="admin-kv">
            <dt>ID</dt>
            <dd>{user.id}</dd>
            <dt>Роль</dt>
            <dd>{user.role}</dd>
            <dt>Реєстрація</dt>
            <dd>{fmtDate(user.createdAt)}</dd>
            <dt>Останній логін</dt>
            <dd>{fmtDate(user.lastLoginAt)}</dd>
            <dt>Сесія</dt>
            <dd>{user.hasActiveSession ? "активна" : "немає"}</dd>
            <dt>Blocked</dt>
            <dd>{user.blocked ? "так" : "ні"}</dd>
          </dl>
        </section>

        <section className="admin-detail-card">
          <h2>Підрядники / push</h2>
          <dl className="admin-kv">
            <dt>Vendors</dt>
            <dd>{user.vendors.total}</dd>
            <dt>По стадіях</dt>
            <dd>
              {Object.keys(user.vendors.byStage).length
                ? Object.entries(user.vendors.byStage)
                    .map(([k, v]) => `${k}: ${v}`)
                    .join(", ")
                : "—"}
            </dd>
            <dt>Push devices</dt>
            <dd>{user.pushDevices.length}</dd>
          </dl>
        </section>

        {user.partnerMembership ? (
          <section className="admin-detail-card">
            <h2>Партнер у весіллі</h2>
            <dl className="admin-kv">
              <dt>Роль</dt>
              <dd>{user.partnerMembership.role}</dd>
              <dt>Owner</dt>
              <dd>
                <Link href={`/admin/users/${user.partnerMembership.owner.id}`}>
                  {user.partnerMembership.owner.email}
                </Link>
              </dd>
              <dt>Місто / дата</dt>
              <dd>
                {user.partnerMembership.city} ·{" "}
                {new Date(user.partnerMembership.date).toLocaleDateString(
                  "uk-UA",
                )}
              </dd>
            </dl>
          </section>
        ) : null}

        {w ? (
          <>
            <section className="admin-detail-card">
              <h2>Весілля</h2>
              <dl className="admin-kv">
                <dt>Пара</dt>
                <dd>
                  {w.partnerOneName || "—"} & {w.partnerTwoName || "—"}
                </dd>
                <dt>Місто</dt>
                <dd>
                  {w.city}
                  {w.cityUndecided ? " (не вирішено)" : ""}
                </dd>
                <dt>Дата</dt>
                <dd>{new Date(w.date).toLocaleDateString("uk-UA")}</dd>
                <dt>Етап</dt>
                <dd>{w.planningStage}</dd>
                <dt>План гостей</dt>
                <dd>
                  {w.guestsPlan}
                  {w.guestsUndecided ? " (не вирішено)" : ""}
                </dd>
                <dt>План бюджету</dt>
                <dd>{fmtMoney(w.budgetPlan)}</dd>
                <dt>Фічі</dt>
                <dd>
                  <div className="admin-flags">
                    <span
                      className={`admin-badge${w.hasDayPlan ? " is-on" : " is-off"}`}
                    >
                      план дня
                    </span>
                    <span
                      className={`admin-badge${w.hasSeating ? " is-on" : " is-off"}`}
                    >
                      розсадка
                    </span>
                    <span
                      className={`admin-badge${w.hasVendorPlan ? " is-on" : " is-off"}`}
                    >
                      vendor plan
                    </span>
                  </div>
                </dd>
              </dl>
            </section>

            <section className="admin-detail-card">
              <h2>Гості / RSVP</h2>
              <dl className="admin-kv">
                <dt>Усього</dt>
                <dd>{w.guests.total}</dd>
                <dt>YES</dt>
                <dd>{w.guests.rsvp.YES ?? 0}</dd>
                <dt>NO</dt>
                <dd>{w.guests.rsvp.NO ?? 0}</dd>
                <dt>MAYBE</dt>
                <dd>{w.guests.rsvp.MAYBE ?? 0}</dd>
                <dt>PENDING</dt>
                <dd>{w.guests.rsvp.PENDING ?? 0}</dd>
              </dl>
            </section>

            <section className="admin-detail-card">
              <h2>Бюджет</h2>
              <dl className="admin-kv">
                <dt>Позицій</dt>
                <dd>{w.budget.items}</dd>
                <dt>Estimated</dt>
                <dd>{fmtMoney(w.budget.estimated)}</dd>
                <dt>Actual</dt>
                <dd>{fmtMoney(w.budget.actual)}</dd>
                <dt>Оплачено</dt>
                <dd>{w.budget.paidItems}</dd>
              </dl>
            </section>

            <section className="admin-detail-card">
              <h2>Чекліст</h2>
              <dl className="admin-kv">
                <dt>Усього</dt>
                <dd>{w.tasks.total}</dd>
                <dt>TODO</dt>
                <dd>{w.tasks.byStatus.TODO ?? 0}</dd>
                <dt>IN_PROGRESS</dt>
                <dd>{w.tasks.byStatus.IN_PROGRESS ?? 0}</dd>
                <dt>DONE</dt>
                <dd>{w.tasks.byStatus.DONE ?? 0}</dd>
              </dl>
            </section>

            <section className="admin-detail-card">
              <h2>Сайт / запрошення</h2>
              <dl className="admin-kv">
                <dt>Сайт</dt>
                <dd>
                  {w.website
                    ? `${w.website.slug} · ${w.website.published ? "published" : "draft"}`
                    : "—"}
                </dd>
                <dt>Published at</dt>
                <dd>{fmtDate(w.website?.publishedAt)}</dd>
                <dt>Запрошення</dt>
                <dd>
                  {w.invitation
                    ? `${w.invitation.templateId} · ${fmtDate(w.invitation.updatedAt)}`
                    : "—"}
                </dd>
              </dl>
            </section>

            {w.members.length > 0 ? (
              <section className="admin-detail-card">
                <h2>Учасники</h2>
                <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13 }}>
                  {w.members.map((m) => (
                    <li key={m.user.id}>
                      {m.role}:{" "}
                      <Link href={`/admin/users/${m.user.id}`}>
                        {m.user.email}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </>
        ) : (
          <section className="admin-detail-card">
            <h2>Весілля</h2>
            <p className="admin-muted" style={{ margin: 0, fontSize: 13 }}>
              Немає власного wedding (можливо лише партнер або порожній акаунт)
            </p>
          </section>
        )}

        <section className="admin-detail-card">
          <h2>Нотифікації</h2>
          <div className="admin-flags">
            {Object.entries(user.notifications).map(([key, on]) => (
              <span
                key={key}
                className={`admin-badge${on ? " is-on" : " is-off"}`}
              >
                {key}
              </span>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
