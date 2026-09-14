"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CabinetNotificationsBell } from "@/components/cabinet-notifications";
import { CabinetProfileMenu } from "@/components/cabinet-profile-menu";
import { PageLoader } from "@/components/ui-loader";
import { RequireAuth } from "@/components/require-auth";
import {
  createExternalVendor,
  getMyWedding,
  getVendorPipeline,
  removeExternalVendor,
  updateExternalVendor,
  type ExternalVendor,
  type VendorPipelineStage,
} from "@/lib/dashboard-api";
import {
  getNotificationsSummary,
  type NotificationsSummary,
} from "@/lib/notifications-api";
import { useAuthStore } from "@/lib/auth-store";
import { toast } from "@/lib/toast";
import {
  VENDOR_CONTACT_METHODS,
  VENDOR_CURRENCIES,
  VENDOR_MANAGER_CATEGORIES,
  formatVendorMoney,
  loadVendorPlan,
  parseVendorMeta,
  resolveVendorCategoryEntry,
  saveVendorPlan,
  serializeVendorMeta,
  vendorManagerCategoryLabel,
  type VendorContactMethod,
  type VendorCurrency,
  type VendorMeta,
} from "@/lib/vendor-manager";
import "../app/couple-cabinet.css";

type FormState = {
  category: string;
  customLabel: string;
  name: string;
  contactMethod: VendorContactMethod;
  phone: string;
  website: string;
  booked: boolean;
  deposit: string;
  depositCurrency: VendorCurrency;
  balance: string;
  balanceCurrency: VendorCurrency;
};

const emptyForm = (): FormState => ({
  category: "",
  customLabel: "",
  name: "",
  contactMethod: "phone",
  phone: "",
  website: "",
  booked: false,
  deposit: "",
  depositCurrency: "UAH",
  balance: "",
  balanceCurrency: "UAH",
});

function contactLabel(method: VendorContactMethod) {
  return VENDOR_CONTACT_METHODS.find((m) => m.id === method)?.label ?? "Контакти";
}

function displayCategory(vendor: ExternalVendor) {
  const meta = parseVendorMeta(vendor.notes);
  if (vendor.category === "other" && meta.customLabel) return meta.customLabel;
  return vendorManagerCategoryLabel(vendor.category);
}

function contactValue(vendor: ExternalVendor, meta: VendorMeta) {
  const method = meta.contactMethod ?? "phone";
  if (method === "instagram") {
    const handle = vendor.website?.replace(/^https?:\/\//, "") || vendor.phone;
    if (!handle) return "—";
    return handle.startsWith("@") ? handle : `@${handle.replace(/^@/, "")}`;
  }
  if (method === "email" || method === "telegram") {
    return vendor.website || vendor.phone || "—";
  }
  return vendor.phone || vendor.website || "—";
}

function VendorsEmptyArt() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className="cabinet-vendors-empty-art"
      src="/cabinet/empty/vendors.png"
      alt=""
      width={360}
      height={200}
      aria-hidden
    />
  );
}

function MyVendorsInner() {
  const user = useAuthStore((s) => s.user);
  const [manual, setManual] = useState<ExternalVendor[]>([]);
  const [plan, setPlan] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<NotificationsSummary | null>(null);
  const [partnerInitials, setPartnerInitials] = useState("П");

  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [planDraft, setPlanDraft] = useState<string[]>([]);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const data = await getVendorPipeline();
      setManual(data.manual);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Помилка");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setPlan(loadVendorPlan());
    void load();
    void getNotificationsSummary()
      .then(setSummary)
      .catch(() => setSummary(null));
    void getMyWedding()
      .then((wedding) => {
        const one =
          wedding?.partnerOneName?.trim().charAt(0).toUpperCase() ||
          user?.name?.trim().charAt(0).toUpperCase() ||
          "П";
        const two = wedding?.partnerTwoName?.trim().charAt(0).toUpperCase() || "";
        setPartnerInitials(two ? `${one}&${two}` : one);
      })
      .catch(() => undefined);
  }, [user?.name]);

  useEffect(() => {
    if (!menuOpenId) return;
    function onDoc() {
      setMenuOpenId(null);
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, [menuOpenId]);

  const booked = useMemo(
    () => manual.filter((v) => v.stage === "CHOSEN"),
    [manual],
  );
  const notBooked = useMemo(
    () => manual.filter((v) => v.stage !== "CHOSEN"),
    [manual],
  );

  const visibleCategories = useMemo(() => {
    const fromPlan = plan.length
      ? plan.map((slug) => resolveVendorCategoryEntry(slug))
      : [];
    const used = new Set(manual.map((v) => v.category));
    const knownSlugs = new Set(fromPlan.map((c) => c.slug));
    const extras = [...used]
      .filter((slug) => !knownSlugs.has(slug))
      .map((slug) => resolveVendorCategoryEntry(slug));
    const base = [...fromPlan, ...extras];
    if (!base.length && manual.length) {
      return [...used].map((slug) => resolveVendorCategoryEntry(slug));
    }
    return base;
  }, [plan, manual]);

  const rows = useMemo(() => {
    return visibleCategories.map((cat) => {
      const vendors = manual.filter((v) => v.category === cat.slug);
      return { cat, vendors };
    });
  }, [visibleCategories, manual]);

  const isEmpty = plan.length === 0 && manual.length === 0;

  function openPlanModal() {
    setPlanDraft(plan.length ? [...plan] : []);
    setPlanModalOpen(true);
  }

  function togglePlanSlug(slug: string) {
    setPlanDraft((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );
  }

  function savePlan() {
    saveVendorPlan(planDraft);
    setPlan(planDraft);
    setPlanModalOpen(false);
    toast.success("Список підрядників збережено");
  }

  function openAdd(category = "") {
    setEditingId(null);
    setForm({ ...emptyForm(), category });
    setFormModalOpen(true);
  }

  function openEdit(vendor: ExternalVendor) {
    const meta = parseVendorMeta(vendor.notes);
    setEditingId(vendor.id);
    setForm({
      category: vendor.category,
      customLabel: meta.customLabel ?? "",
      name: vendor.name,
      contactMethod: meta.contactMethod ?? "phone",
      phone: vendor.phone ?? "",
      website: vendor.website ?? "",
      booked: vendor.stage === "CHOSEN",
      deposit: meta.deposit != null ? String(meta.deposit) : "",
      depositCurrency: meta.depositCurrency ?? "UAH",
      balance:
        meta.balance != null
          ? String(meta.balance)
          : vendor.quotedPrice != null
            ? String(vendor.quotedPrice)
            : "",
      balanceCurrency: meta.balanceCurrency ?? "UAH",
    });
    setFormModalOpen(true);
    setMenuOpenId(null);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.category) {
      toast.error("Обери тип підрядника");
      return;
    }
    if (!form.name.trim()) {
      toast.error("Вкажи імʼя підрядника");
      return;
    }
    if (form.category === "other" && !form.customLabel.trim()) {
      toast.error("Вкажи назву типу підрядника");
      return;
    }

    const deposit = form.deposit.trim() ? Number(form.deposit) : null;
    const balance = form.balance.trim() ? Number(form.balance) : null;
    const stage: VendorPipelineStage = form.booked ? "CHOSEN" : "SAVED";
    const notes = serializeVendorMeta({
      contactMethod: form.contactMethod,
      deposit: form.booked ? deposit : null,
      depositCurrency: form.depositCurrency,
      balance: form.booked ? balance : null,
      balanceCurrency: form.balanceCurrency,
      customLabel: form.category === "other" ? form.customLabel : null,
    });

    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        category: form.category,
        phone: form.phone.trim() || undefined,
        website: form.website.trim() || undefined,
        quotedPrice: form.booked ? balance : null,
        notes: notes ?? undefined,
        stage,
      };
      if (editingId) {
        await updateExternalVendor(editingId, payload);
        toast.success("Підрядника оновлено");
      } else {
        await createExternalVendor(payload);
        if (!plan.includes(form.category)) {
          const next = [...plan, form.category];
          saveVendorPlan(next);
          setPlan(next);
        }
      }
      setFormModalOpen(false);
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Не вдалось зберегти");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Видалити підрядника?")) return;
    try {
      await removeExternalVendor(id);
      setMenuOpenId(null);
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Не вдалось видалити");
    }
  }

  if (loading) return <PageLoader label="Завантажуємо підрядників…" />;

  return (
    <div className="cabinet-tasks-page cabinet-vendors-page">
      <div className="cabinet-tasks-top">
        <h1 className="cabinet-tasks-title">Підрядники</h1>
        <div className="cabinet-overview-actions">
          <CabinetNotificationsBell summary={summary} />
          <CabinetProfileMenu initials={partnerInitials} />
        </div>
      </div>

      {error ? <p className="cabinet-tasks-error">{error}</p> : null}

      {isEmpty ? (
        <div className="cabinet-guests-empty cabinet-vendors-empty">
          <div className="cabinet-guests-empty-glow" aria-hidden />
          <VendorsEmptyArt />
          <h2>Внесіть своїх підрядників</h2>
          <p>
            Тримайте усі контакти, ціни, завдатки і процеси в одному місці, а
            також надсилайте розклад весільного дня та інші деталі весілля усім
            підрядникам одночасно звідси.
          </p>
          <div className="cabinet-guests-empty-actions">
            <button
              type="button"
              className="cabinet-vendors-primary-btn"
              onClick={openPlanModal}
            >
              + Додати підрядників
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="cabinet-vendors-toolbar">
            <div className="cabinet-vendors-stats">
              <article className="cabinet-vendors-stat">
                <p className="cabinet-vendors-stat-value">{manual.length}</p>
                <p className="cabinet-vendors-stat-label">Всього підрядників</p>
              </article>
              <article className="cabinet-vendors-stat">
                <p className="cabinet-vendors-stat-value">{booked.length}</p>
                <p className="cabinet-vendors-stat-label">Заброньовано</p>
              </article>
              <article className="cabinet-vendors-stat">
                <p className="cabinet-vendors-stat-value">{notBooked.length}</p>
                <p className="cabinet-vendors-stat-label">Не заброньовано</p>
              </article>
            </div>
            <button
              type="button"
              className="cabinet-vendors-primary-btn"
              onClick={() => openAdd()}
            >
              + Додати підрядника
            </button>
          </div>

          <div className="cabinet-vendors-list">
            {rows.map(({ cat, vendors }) => {
              if (!vendors.length) {
                return (
                  <div key={cat.slug} className="cabinet-vendors-row is-empty">
                    <h3>{cat.name}</h3>
                    <button
                      type="button"
                      className="cabinet-vendors-add-mini"
                      onClick={() => openAdd(cat.slug)}
                    >
                      + Додати
                    </button>
                  </div>
                );
              }

              return vendors.map((vendor) => {
                const meta = parseVendorMeta(vendor.notes);
                const method = meta.contactMethod ?? "phone";
                const bookedVendor = vendor.stage === "CHOSEN";
                return (
                  <div key={vendor.id} className="cabinet-vendors-row is-filled">
                    <h3>{displayCategory(vendor)}</h3>
                    <div className="cabinet-vendors-cell">
                      <span className="cabinet-vendors-cell-label">Виконавець</span>
                      <span className="cabinet-vendors-cell-value">{vendor.name}</span>
                    </div>
                    <div className="cabinet-vendors-cell">
                      <span className="cabinet-vendors-cell-label">
                        {contactLabel(method)}
                      </span>
                      <span className="cabinet-vendors-cell-value">
                        {contactValue(vendor, meta)}
                      </span>
                    </div>
                    <div className="cabinet-vendors-cell">
                      <span className="cabinet-vendors-cell-label">Треба доплатити</span>
                      <span className="cabinet-vendors-cell-value">
                        {bookedVendor
                          ? formatVendorMoney(
                              meta.balance ?? vendor.quotedPrice,
                              meta.balanceCurrency,
                            )
                          : "—"}
                      </span>
                    </div>
                    <div className="cabinet-vendors-cell">
                      <span className="cabinet-vendors-cell-label">Завдаток</span>
                      <span className="cabinet-vendors-cell-value">
                        {bookedVendor
                          ? formatVendorMoney(meta.deposit, meta.depositCurrency)
                          : "—"}
                      </span>
                    </div>
                    <span
                      className={`cabinet-vendors-badge${bookedVendor ? " is-booked" : ""}`}
                    >
                      {bookedVendor ? "Заброньовано" : "Не заброньовано"}
                    </span>
                    <div className="cabinet-vendors-menu-wrap">
                      <button
                        type="button"
                        className="cabinet-vendors-menu-btn"
                        aria-label="Меню"
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuOpenId((id) => (id === vendor.id ? null : vendor.id));
                        }}
                      >
                        ···
                      </button>
                      {menuOpenId === vendor.id ? (
                        <div className="cabinet-vendors-menu" role="menu">
                          <button type="button" onClick={() => openEdit(vendor)}>
                            Редагувати
                          </button>
                          <button type="button" onClick={() => void onDelete(vendor.id)}>
                            Видалити
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              });
            })}
          </div>

          <button
            type="button"
            className="cabinet-vendors-edit-plan"
            onClick={openPlanModal}
          >
            Змінити список типів підрядників
          </button>
        </>
      )}

      {planModalOpen ? (
        <div className="cabinet-modal-root" role="dialog" aria-modal="true">
          <button
            type="button"
            className="cabinet-modal-backdrop"
            aria-label="Закрити"
            onClick={() => setPlanModalOpen(false)}
          />
          <div className="cabinet-modal cabinet-vendors-plan-modal">
            <div className="cabinet-modal-head">
              <div>
                <h2>Мені будуть потрібні такі підрядники</h2>
                <p>
                  Оберіть всіх, кого плануєте мати на весіллі - це допоможе
                  побачити цілісну картину. Пізніше ви зможете редагувати
                  список.
                </p>
              </div>
              <button
                type="button"
                className="cabinet-modal-close"
                aria-label="Закрити"
                onClick={() => setPlanModalOpen(false)}
              >
                ×
              </button>
            </div>
            <ul className="cabinet-vendors-plan-list">
              {VENDOR_MANAGER_CATEGORIES.filter((c) => c.slug !== "other").map(
                (cat) => {
                  const checked = planDraft.includes(cat.slug);
                  return (
                    <li key={cat.slug}>
                      <label className="cabinet-vendors-plan-item">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => togglePlanSlug(cat.slug)}
                        />
                        <span className="cabinet-vendors-plan-check" aria-hidden />
                        <span>{cat.name}</span>
                      </label>
                    </li>
                  );
                },
              )}
            </ul>
            <div className="cabinet-modal-actions">
              <button
                type="button"
                className="cabinet-drawer-cancel"
                onClick={() => setPlanModalOpen(false)}
              >
                Скасувати
              </button>
              <button
                type="button"
                className="cabinet-drawer-save"
                onClick={savePlan}
              >
                Зберегти
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {formModalOpen ? (
        <div className="cabinet-modal-root" role="dialog" aria-modal="true">
          <button
            type="button"
            className="cabinet-modal-backdrop"
            aria-label="Закрити"
            onClick={() => setFormModalOpen(false)}
          />
          <form className="cabinet-modal cabinet-vendors-form-modal" onSubmit={onSubmit}>
            <div className="cabinet-modal-head">
              <h2>{editingId ? "Редагувати підрядника" : "Додати підрядника"}</h2>
              <button
                type="button"
                className="cabinet-modal-close"
                aria-label="Закрити"
                onClick={() => setFormModalOpen(false)}
              >
                ×
              </button>
            </div>

            <label className="cabinet-drawer-field">
              <span>Тип підрядника</span>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm((f) => ({ ...f, category: e.target.value }))
                }
                required
              >
                <option value="">Обрати тип</option>
                {VENDOR_MANAGER_CATEGORIES.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </label>

            {form.category === "other" ? (
              <label className="cabinet-drawer-field">
                <span>Назва підрядника</span>
                <input
                  value={form.customLabel}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, customLabel: e.target.value }))
                  }
                  placeholder="Наприклад: охоронець, водій автобуса"
                  required
                />
              </label>
            ) : null}

            <label className="cabinet-drawer-field">
              <span>Імʼя підрядника</span>
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Наприклад: Ліля Василенко"
                required
              />
            </label>

            <div className="cabinet-vendors-methods">
              <p className="cabinet-vendors-methods-label">Спосіб спілкування</p>
              <div className="cabinet-vendors-methods-list">
                {VENDOR_CONTACT_METHODS.map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    className={`cabinet-vendors-method${
                      form.contactMethod === method.id ? " is-active" : ""
                    }`}
                    onClick={() =>
                      setForm((f) => ({ ...f, contactMethod: method.id }))
                    }
                  >
                    {method.label}
                  </button>
                ))}
              </div>
            </div>

            <label className="cabinet-drawer-field">
              <span>
                {form.contactMethod === "instagram"
                  ? "Instagram підрядника"
                  : form.contactMethod === "email"
                    ? "Email підрядника"
                    : form.contactMethod === "telegram"
                      ? "Telegram підрядника"
                      : "Номер телефону підрядника"}
              </span>
              <input
                value={
                  form.contactMethod === "phone" ||
                  form.contactMethod === "viber" ||
                  form.contactMethod === "messenger" ||
                  form.contactMethod === "meet" ||
                  form.contactMethod === "other"
                    ? form.phone
                    : form.website
                }
                onChange={(e) => {
                  const value = e.target.value;
                  if (
                    form.contactMethod === "instagram" ||
                    form.contactMethod === "email" ||
                    form.contactMethod === "telegram"
                  ) {
                    setForm((f) => ({ ...f, website: value }));
                  } else {
                    setForm((f) => ({ ...f, phone: value }));
                  }
                }}
                placeholder={
                  form.contactMethod === "instagram"
                    ? "@username"
                    : form.contactMethod === "email"
                      ? "name@example.com"
                      : "+380"
                }
              />
            </label>

            <label className="cabinet-drawer-field">
              <span>Статус</span>
              <select
                value={form.booked ? "booked" : "open"}
                onChange={(e) =>
                  setForm((f) => ({ ...f, booked: e.target.value === "booked" }))
                }
              >
                <option value="open">Не заброньовано</option>
                <option value="booked">Заброньовано</option>
              </select>
            </label>

            {form.booked ? (
              <>
                <div className="cabinet-vendors-money-row">
                  <label className="cabinet-drawer-field">
                    <span>Завдаток</span>
                    <input
                      inputMode="numeric"
                      value={form.deposit}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, deposit: e.target.value }))
                      }
                      placeholder="0"
                    />
                  </label>
                  <label className="cabinet-drawer-field">
                    <span>Валюта</span>
                    <select
                      value={form.depositCurrency}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          depositCurrency: e.target.value as VendorCurrency,
                        }))
                      }
                    >
                      {VENDOR_CURRENCIES.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <div className="cabinet-vendors-money-row">
                  <label className="cabinet-drawer-field">
                    <span>Треба доплатити</span>
                    <input
                      inputMode="numeric"
                      value={form.balance}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, balance: e.target.value }))
                      }
                      placeholder="0"
                    />
                  </label>
                  <label className="cabinet-drawer-field">
                    <span>Валюта</span>
                    <select
                      value={form.balanceCurrency}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          balanceCurrency: e.target.value as VendorCurrency,
                        }))
                      }
                    >
                      {VENDOR_CURRENCIES.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </>
            ) : null}

            <div className="cabinet-modal-actions">
              <button
                type="button"
                className="cabinet-drawer-cancel"
                onClick={() => setFormModalOpen(false)}
              >
                Скасувати
              </button>
              <button type="submit" className="cabinet-drawer-save" disabled={saving}>
                {saving ? "Зберігаємо…" : "Зберегти"}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}

export function CoupleMyVendorsPage() {
  return (
    <RequireAuth roles={["COUPLE", "ADMIN"]}>
      <MyVendorsInner />
    </RequireAuth>
  );
}
