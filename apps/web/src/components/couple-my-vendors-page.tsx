"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CabinetPageHeader } from "@/components/cabinet-page-header";
import { CabinetFormActions } from "@/components/cabinet-form-actions";
import { useMenuOutsideClose } from "@/hooks/use-menu-outside-close";
import {
  CabinetContextMenu,
  CabinetContextMenuItem,
} from "@/components/cabinet-context-menu";
import { IconEdit } from "@/components/icon-edit";
import { IconMore } from "@/components/icon-more";
import { IconTrash } from "@/components/icon-trash";
import { PageLoader } from "@/components/ui-loader";
import { RequireAuth } from "@/components/require-auth";
import { CabinetEmptyState } from "@/components/cabinet-empty-state";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DeleteConfirmModal } from "@/components/delete-confirm-modal";
import { CabinetOverlay } from "@/components/ui/cabinet-overlay";
import { Select } from "@/components/ui/select";
import { TextInput } from "@/components/ui/text-input";
import {
  createExternalVendor,
  getMyWedding,
  getVendorPipeline,
  removeExternalVendor,
  saveVendorPlan,
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
  clearLegacyVendorPlan,
  formatVendorMoney,
  parseVendorMeta,
  resolveVendorCategoryEntry,
  serializeVendorMeta,
  vendorManagerCategoryLabel,
  type VendorContactMethod,
  type VendorCurrency,
  type VendorMeta,
} from "@/lib/vendor-manager";
import "@/styles/cabinet/cabinet.scss";

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
  const [deleteTarget, setDeleteTarget] = useState<ExternalVendor | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const data = await getVendorPipeline();
      setManual(data.manual);
      setPlan(Array.isArray(data.plan) ? data.plan : []);
      clearLegacyVendorPlan();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Помилка");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
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

  useMenuOutsideClose(Boolean(menuOpenId), () => setMenuOpenId(null));

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

  /** Categories that already have a vendor can't be unchecked until that vendor is removed. */
  const lockedPlanSlugs = useMemo(() => {
    const locked = new Set<string>();
    for (const vendor of manual) locked.add(vendor.category);
    return locked;
  }, [manual]);

  function openPlanModal() {
    const base = plan.length ? [...plan] : [];
    for (const slug of lockedPlanSlugs) {
      if (!base.includes(slug)) base.push(slug);
    }
    setPlanDraft(base);
    setPlanModalOpen(true);
  }

  function togglePlanSlug(slug: string) {
    if (lockedPlanSlugs.has(slug)) return;
    setPlanDraft((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );
  }

  async function savePlan() {
    setSaving(true);
    try {
      const next = [...planDraft];
      for (const slug of lockedPlanSlugs) {
        if (!next.includes(slug)) next.push(slug);
      }
      const saved = await saveVendorPlan(next);
      setPlan(saved.plan);
      clearLegacyVendorPlan();
      setPlanModalOpen(false);
      toast.success("Список підрядників збережено");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Не вдалось зберегти");
    } finally {
      setSaving(false);
    }
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
          const saved = await saveVendorPlan(next);
          setPlan(saved.plan);
          clearLegacyVendorPlan();
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

  function requestDelete(vendor: ExternalVendor) {
    setMenuOpenId(null);
    setDeleteTarget(vendor);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await removeExternalVendor(deleteTarget.id);
      setDeleteTarget(null);
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Не вдалось видалити");
    } finally {
      setDeleting(false);
    }
  }

  if (loading) return <PageLoader label="Завантажуємо підрядників…" />;

  return (
    <div className="cabinet-tasks-page cabinet-vendors-page">
      <CabinetPageHeader
        title="Підрядники"
        summary={summary}
        initials={partnerInitials}
      />

      {error ? <p className="cabinet-tasks-error">{error}</p> : null}

      {isEmpty ? (
        <CabinetEmptyState
          art={{
            src: "/cabinet/empty/vendors.svg",
            width: 310,
            height: 202,
            className: "cabinet-vendors-empty-art",
          }}
          title="Внесіть своїх підрядників"
          description={
            <p>
              Тримайте усі контакти, ціни, завдатки і процеси в одному місці, а
              також надсилайте розклад весільного дня та інші деталі весілля
              усім підрядникам одночасно звідси.
            </p>
          }
          actions={
            <Button
              type="button"
              tone="ink"
              size="m"
              className="cabinet-empty-cta"
              onClick={openPlanModal}
            >
              Додати підрядників
            </Button>
          }
        />
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
            <Button
              type="button"
              tone="ink"
              size="m"
              className="cabinet-vendors-primary-btn cabinet-vendors-toolbar-primary"
              onClick={() => openAdd()}
            >
              + Додати підрядника
            </Button>
          </div>

          <div className="cabinet-vendors-list">
            {rows.map(({ cat, vendors }) => {
              if (!vendors.length) {
                return (
                  <div key={cat.slug} className="cabinet-vendors-row is-empty">
                    <h3>{cat.name}</h3>
                    <Button
                      type="button"
                      tone="ink"
                      size="m"
                      className="cabinet-vendors-add-mini"
                      onClick={() => openAdd(cat.slug)}
                    >
                      + Додати
                    </Button>
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
                    <div className="cabinet-vendors-cell is-balance">
                      <span className="cabinet-vendors-cell-label">До сплати</span>
                      <span className="cabinet-vendors-cell-value">
                        {bookedVendor
                          ? formatVendorMoney(
                              meta.balance ?? vendor.quotedPrice,
                              meta.balanceCurrency,
                            )
                          : "—"}
                      </span>
                    </div>
                    <div className="cabinet-vendors-cell is-deposit">
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
                    <div className="cabinet-ctx-menu-wrap cabinet-vendors-menu-wrap">
                      <button
                        type="button"
                        className="cabinet-vendors-menu-btn"
                        aria-label="Меню"
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuOpenId((id) => (id === vendor.id ? null : vendor.id));
                        }}
                      >
                        <IconMore />
                      </button>
                      {menuOpenId === vendor.id ? (
                        <CabinetContextMenu>
                          <CabinetContextMenuItem
                            icon={<IconEdit />}
                            onClick={() => openEdit(vendor)}
                          >
                            Редагувати
                          </CabinetContextMenuItem>
                          <CabinetContextMenuItem
                            icon={<IconTrash />}
                            danger
                            onClick={() => requestDelete(vendor)}
                          >
                            Видалити
                          </CabinetContextMenuItem>
                        </CabinetContextMenu>
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

          <div className="cabinet-vendors-mobile-bar">
            <Button
              type="button"
              tone="ink"
              size="m"
              className="cabinet-vendors-primary-btn"
              onClick={() => openAdd()}
            >
              + Додати підрядника
            </Button>
          </div>
        </>
      )}

      <CabinetOverlay
        open={planModalOpen}
        onClose={() => setPlanModalOpen(false)}
        title="Мені будуть потрібні такі підрядники"
        subtitle="Оберіть всіх, кого плануєте мати на весіллі - це допоможе побачити цілісну картину. Пізніше ви зможете редагувати список."
        variant="modal"
        width={520}
        mobileVariant="fullscreen"
        panelClassName="cabinet-vendors-plan-modal"
        footerClassName="cabinet-modal-actions cabinet-vendors-modal-actions"
        footer={
          <CabinetFormActions
            onCancel={() => setPlanModalOpen(false)}
            saveType="button"
            onSave={() => void savePlan()}
            saveDisabled={saving}
          />
        }
      >
        <ul className="cabinet-vendors-plan-list">
          {VENDOR_MANAGER_CATEGORIES.filter((c) => c.slug !== "other").map(
            (cat) => {
              const locked = lockedPlanSlugs.has(cat.slug);
              const checked = locked || planDraft.includes(cat.slug);
              return (
                <li key={cat.slug}>
                  <label
                    className={`cabinet-vendors-plan-item${locked ? " is-locked" : ""}`}
                    title={
                      locked
                        ? "Спочатку видали підрядника цього типу"
                        : undefined
                    }
                  >
                    <Checkbox
                      checked={checked}
                      disabled={locked}
                      onCheckedChange={() => togglePlanSlug(cat.slug)}
                      aria-label={cat.name}
                    />
                    <span>{cat.name}</span>
                  </label>
                </li>
              );
            },
          )}
        </ul>
      </CabinetOverlay>

      <CabinetOverlay
        open={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        title={editingId ? "Редагувати підрядника" : "Додати підрядника"}
        variant="modal"
        width={520}
        mobileVariant="fullscreen"
        panelClassName="cabinet-vendors-form-modal"
        bodyClassName="cabinet-vendors-form-body"
        footerClassName="cabinet-modal-actions cabinet-vendors-modal-actions"
        asForm
        onSubmit={onSubmit}
        footer={
          <CabinetFormActions
            onCancel={() => setFormModalOpen(false)}
            saveLoading={saving}
            saveLoadingText="Зберігаємо…"
          />
        }
      >
        <Select
          label="Тип підрядника"
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
        </Select>

        {form.category === "other" ? (
          <TextInput
            label="Назва підрядника"
            value={form.customLabel}
            onChange={(e) =>
              setForm((f) => ({ ...f, customLabel: e.target.value }))
            }
            placeholder="Наприклад: охоронець, водій автобуса"
            required
          />
        ) : null}

        <TextInput
          label="Імʼя підрядника"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          placeholder="Наприклад: Ліля Василенко"
          required
        />

        <Select
          label="Спосіб спілкування"
          value={form.contactMethod}
          onChange={(e) =>
            setForm((f) => ({
              ...f,
              contactMethod: e.target.value as VendorContactMethod,
            }))
          }
        >
          {VENDOR_CONTACT_METHODS.map((method) => (
            <option key={method.id} value={method.id}>
              {method.label}
            </option>
          ))}
        </Select>

        <TextInput
          label={
            form.contactMethod === "instagram"
              ? "Instagram підрядника"
              : form.contactMethod === "email"
                ? "Email підрядника"
                : form.contactMethod === "telegram"
                  ? "Telegram підрядника"
                  : "Номер телефону підрядника"
          }
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

        <Select
          label="Статус"
          value={form.booked ? "booked" : "open"}
          onChange={(e) =>
            setForm((f) => ({ ...f, booked: e.target.value === "booked" }))
          }
        >
          <option value="open">Не заброньовано</option>
          <option value="booked">Заброньовано</option>
        </Select>

        {form.booked ? (
          <>
            <div className="cabinet-vendors-money-row">
              <TextInput
                label="Завдаток"
                inputMode="numeric"
                value={form.deposit}
                onChange={(e) =>
                  setForm((f) => ({ ...f, deposit: e.target.value }))
                }
                placeholder="0"
              />
              <Select
                label="Валюта"
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
              </Select>
            </div>
            <div className="cabinet-vendors-money-row">
              <TextInput
                label="Треба доплатити"
                inputMode="numeric"
                value={form.balance}
                onChange={(e) =>
                  setForm((f) => ({ ...f, balance: e.target.value }))
                }
                placeholder="0"
              />
              <Select
                label="Валюта"
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
              </Select>
            </div>
          </>
        ) : null}
      </CabinetOverlay>

      <DeleteConfirmModal
        open={Boolean(deleteTarget)}
        title="Видалити підрядника"
        description={
          deleteTarget
            ? `Ви впевнені, що хочете видалити «${deleteTarget.name}»?`
            : "Ви впевнені, що хочете видалити цього підрядника?"
        }
        loading={deleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => void confirmDelete()}
      />
    </div>
  );
}

export function CoupleMyVendorsPage() {
  return (
    <RequireAuth roles={["COUPLE"]}>
      <MyVendorsInner />
    </RequireAuth>
  );
}
