"use client";

import { PageLoader } from "@/components/ui-loader";
import { FormEvent, useEffect, useState } from "react";
import {
  getMyVendorProfile,
  upsertVendorProfile,
} from "@/lib/dashboard-api";
import type { Category } from "@/lib/api";
import { CityAutocomplete } from "@/components/city-autocomplete";
import { DashboardNav } from "@/components/dashboard-nav";
import { RequireAuth } from "@/components/require-auth";
import { VendorOnboardingGuide } from "@/components/vendor-onboarding-guide";
import { PhotoUploader } from "@/components/photo-uploader";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

type PackageDraft = {
  title: string;
  price: number;
  description: string;
  includes: string;
  duration: string;
  isPopular: boolean;
};

type FaqDraft = {
  question: string;
  answer: string;
};

type TeamDraft = {
  name: string;
  role: string;
  bio: string;
  photoUrl: string;
};

function VendorProfileInner() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [city, setCity] = useState("");
  const [priceFrom, setPriceFrom] = useState(20000);
  const [priceTo, setPriceTo] = useState<number | "">("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [instagram, setInstagram] = useState("");
  const [address, setAddress] = useState("");
  const [yearsInBusiness, setYearsInBusiness] = useState<number | "">("");
  const [teamSize, setTeamSize] = useState<number | "">("");
  const [responseTime, setResponseTime] = useState("");
  const [bookingLeadTime, setBookingLeadTime] = useState("");
  const [availabilityNote, setAvailabilityNote] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [dealTitle, setDealTitle] = useState("");
  const [dealDescription, setDealDescription] = useState("");
  const [stylesText, setStylesText] = useState("");
  const [servicesText, setServicesText] = useState("");
  const [serviceAreasText, setServiceAreasText] = useState("");
  const [languagesText, setLanguagesText] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [packages, setPackages] = useState<PackageDraft[]>([]);
  const [faqs, setFaqs] = useState<FaqDraft[]>([]);
  const [team, setTeam] = useState<TeamDraft[]>([]);
  const [vendorId, setVendorId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const [catsRes, profile] = await Promise.all([
          fetch(`${API_URL}/api/categories`).then((r) => r.json()) as Promise<
            Category[]
          >,
          getMyVendorProfile(),
        ]);
        setCategories(catsRes);
        if (profile) {
          setVendorId(profile.id);
          setName(profile.name);
          setTagline(profile.tagline ?? "");
          setDescription(profile.description);
          setCategoryId(profile.category.id);
          setCity(profile.city);
          setPriceFrom(profile.priceFrom);
          setPriceTo(profile.priceTo ?? "");
          setPhone(profile.phone ?? "");
          setWebsite(profile.website ?? "");
          setInstagram(profile.instagram ?? "");
          setAddress(profile.address ?? "");
          setYearsInBusiness(profile.yearsInBusiness ?? "");
          setTeamSize(profile.teamSize ?? "");
          setResponseTime(profile.responseTime ?? "");
          setBookingLeadTime(profile.bookingLeadTime ?? "");
          setAvailabilityNote(profile.availabilityNote ?? "");
          setVideoUrl(profile.videoUrl ?? "");
          setDealTitle(profile.dealTitle ?? "");
          setDealDescription(profile.dealDescription ?? "");
          setStylesText((profile.styles ?? []).join(", "));
          setServicesText((profile.services ?? []).join(", "));
          setServiceAreasText((profile.serviceAreas ?? []).join(", "));
          setLanguagesText((profile.languages ?? []).join(", "));
          setPhotos(profile.photos.map((p) => p.url));
          setPackages(
            (profile.packages ?? []).map((p) => ({
              title: p.title,
              price: p.price,
              description: p.description,
              includes: p.includes,
              duration: p.duration ?? "",
              isPopular: p.isPopular ?? false,
            })),
          );
          setTeam(
            (profile.team ?? []).map((member) => ({
              name: member.name,
              role: member.role,
              bio: member.bio,
              photoUrl: member.photoUrl ?? "",
            })),
          );
          setFaqs(
            (profile.faqs ?? []).map((f) => ({
              question: f.question,
              answer: f.answer,
            })),
          );
          setStatus(profile.status);
        } else if (catsRes[0]) {
          setCategoryId(catsRes[0].id);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Помилка");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function onSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setOk(null);
    try {
      const saved = await upsertVendorProfile({
        name,
        tagline,
        description,
        categoryId,
        city,
        priceFrom,
        priceTo: priceTo === "" ? null : Number(priceTo),
        phone: phone || null,
        website: website || null,
        instagram: instagram || null,
        address: address || null,
        yearsInBusiness:
          yearsInBusiness === "" ? null : Number(yearsInBusiness),
        teamSize: teamSize === "" ? null : Number(teamSize),
        responseTime: responseTime || null,
        bookingLeadTime: bookingLeadTime || null,
        availabilityNote,
        videoUrl: videoUrl || null,
        dealTitle: dealTitle || null,
        dealDescription: dealDescription || null,
        styles: stylesText
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        services: servicesText
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        serviceAreas: serviceAreasText
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        languages: languagesText
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        photoUrls: photos,
        packages,
        faqs,
        team: team.map((member) => ({
          ...member,
          photoUrl: member.photoUrl || null,
        })),
      });
      setVendorId(saved.id);
      setStatus(saved.status);
      setPhotos(saved.photos.map((p) => p.url));
      setOk(
        saved.status === "PENDING"
          ? "Профіль збережено і відправлено на модерацію"
          : "Профіль збережено",
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не збережено");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <PageLoader />;
  }

  const completionChecks = [
    Boolean(name && tagline && description && categoryId && city),
    photos.length >= 5,
    packages.length > 0,
    Boolean(servicesText),
    team.length > 0,
    faqs.length > 0,
    Boolean(phone || website || instagram),
    Boolean(availabilityNote),
  ];
  const completion = Math.round(
    (completionChecks.filter(Boolean).length / completionChecks.length) * 100,
  );

  return (
    <>
      <DashboardNav variant="VENDOR" />
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-sm uppercase tracking-[0.14em] text-ink-soft">
            Вітрина в каталозі
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl text-ink">
            Редактор профілю
          </h1>
          <p className="mt-2 text-ink-soft">
            Заповни секції — і сторінка виглядатиме як повноцінна вітрина.
            {status ? ` Статус: ${status}` : ""}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="min-w-28 rounded-xl bg-mist px-4 py-3">
            <p className="text-xs text-ink-soft">Заповнено</p>
            <p className="mt-1 text-xl font-semibold text-sage-deep">{completion}%</p>
          </div>
          {vendorId && status === "APPROVED" ? (
            <Link
              href={`/vendors/${vendorId}`}
              target="_blank"
              className="rounded-full border border-line bg-white px-4 py-3 text-sm font-semibold text-ink hover:border-sage/40"
            >
              Переглянути ↗
            </Link>
          ) : null}
        </div>
      </div>

      <nav className="sticky top-0 z-30 mt-7 overflow-x-auto border-y border-line bg-paper/95 backdrop-blur">
        <div className="flex min-w-max gap-5">
          {[
            ["#basic", "Основне"],
            ["#media", "Медіа"],
            ["#services", "Послуги"],
            ["#pricing", "Пакети"],
            ["#team", "Команда"],
            ["#availability", "Доступність"],
            ["#faq", "FAQ"],
            ["#contacts", "Контакти"],
          ].map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="border-b-2 border-transparent py-4 text-sm font-medium text-ink-soft hover:border-sage hover:text-ink"
            >
              {label}
            </a>
          ))}
        </div>
      </nav>

      <div className="mt-8">
        <VendorOnboardingGuide
          hasProfile={Boolean(status)}
          vendorStatus={status}
          requestsCount={0}
        />
      </div>

      {error ? (
        <p className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}
      {ok ? (
        <p className="mt-6 rounded-xl border border-sage/30 bg-mist px-4 py-3 text-sm text-sage-deep">
          {ok}.{" "}
          <Link href="/vendor/dashboard" className="underline underline-offset-4">
            Назад у кабінет
          </Link>
        </p>
      ) : null}

      <form
        onSubmit={onSave}
        className="mt-8 max-w-4xl space-y-8 rounded-2xl border border-line bg-white p-6 md:p-8"
      >
        <section id="basic" className="scroll-mt-20 space-y-4">
          <h2 className="font-[family-name:var(--font-display)] text-2xl">
            Основне
          </h2>
          <div>
            <label className="mb-1 block text-sm text-ink-soft">Назва</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-line px-4 py-3 outline-none focus:border-sage"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-ink-soft">
              Короткий слоган
            </label>
            <input
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="Живі історії без постановочних кадрів"
              className="w-full rounded-xl border border-line px-4 py-3 outline-none focus:border-sage"
            />
            <p className="mt-1 text-xs text-ink-soft">
              Один сильний рядок під назвою профілю.
            </p>
          </div>
          <div>
            <label className="mb-1 block text-sm text-ink-soft">Опис</label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-line px-4 py-3 outline-none focus:border-sage"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-ink-soft">Категорія</label>
              <select
                required
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full rounded-xl border border-line px-4 py-3 outline-none focus:border-sage"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm text-ink-soft">Місто</label>
              <CityAutocomplete
                required
                value={city}
                onChange={setCity}
                className="w-full rounded-xl border border-line px-4 py-3 outline-none focus:border-sage"
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm text-ink-soft">Ціна від</label>
              <input
                type="number"
                min={0}
                required
                value={priceFrom}
                onChange={(e) => setPriceFrom(Number(e.target.value))}
                className="w-full rounded-xl border border-line px-4 py-3 outline-none focus:border-sage"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-ink-soft">Ціна до</label>
              <input
                type="number"
                min={0}
                value={priceTo}
                onChange={(e) =>
                  setPriceTo(e.target.value ? Number(e.target.value) : "")
                }
                className="w-full rounded-xl border border-line px-4 py-3 outline-none focus:border-sage"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-ink-soft">Років у справі</label>
              <input
                type="number"
                min={0}
                value={yearsInBusiness}
                onChange={(e) =>
                  setYearsInBusiness(
                    e.target.value ? Number(e.target.value) : "",
                  )
                }
                className="w-full rounded-xl border border-line px-4 py-3 outline-none focus:border-sage"
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm text-ink-soft">Розмір команди</label>
              <input
                type="number"
                min={1}
                value={teamSize}
                onChange={(e) =>
                  setTeamSize(e.target.value ? Number(e.target.value) : "")
                }
                className="w-full rounded-xl border border-line px-4 py-3 outline-none focus:border-sage"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-ink-soft">Час відповіді</label>
              <input
                value={responseTime}
                onChange={(e) => setResponseTime(e.target.value)}
                placeholder="протягом 2 годин"
                className="w-full rounded-xl border border-line px-4 py-3 outline-none focus:border-sage"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-ink-soft">Бронюють заздалегідь</label>
              <input
                value={bookingLeadTime}
                onChange={(e) => setBookingLeadTime(e.target.value)}
                placeholder="за 6–12 місяців"
                className="w-full rounded-xl border border-line px-4 py-3 outline-none focus:border-sage"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm text-ink-soft">
              Стилі (через кому)
            </label>
            <input
              value={stylesText}
              onChange={(e) => setStylesText(e.target.value)}
              placeholder="романтичний, мінімалізм, репортаж"
              className="w-full rounded-xl border border-line px-4 py-3 outline-none focus:border-sage"
            />
          </div>
        </section>

        <section id="contacts" className="scroll-mt-20 space-y-4">
          <h2 className="font-[family-name:var(--font-display)] text-2xl">
            Контакти
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Телефон"
              className="rounded-xl border border-line px-4 py-3 outline-none focus:border-sage"
            />
            <input
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              placeholder="Instagram без @"
              className="rounded-xl border border-line px-4 py-3 outline-none focus:border-sage"
            />
            <input
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="Сайт"
              className="rounded-xl border border-line px-4 py-3 outline-none focus:border-sage"
            />
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Адреса / район"
              className="rounded-xl border border-line px-4 py-3 outline-none focus:border-sage"
            />
          </div>
        </section>

        <section id="media" className="scroll-mt-20 space-y-4">
          <h2 className="font-[family-name:var(--font-display)] text-2xl">
            Фото
          </h2>
          <PhotoUploader urls={photos} onChange={setPhotos} />
          <div>
            <label className="mb-1 block text-sm text-ink-soft">
              Посилання на showreel / відео
            </label>
            <input
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://youtube.com/..."
              className="w-full rounded-xl border border-line px-4 py-3 outline-none focus:border-sage"
            />
          </div>
        </section>

        <section id="services" className="scroll-mt-20 space-y-4">
          <h2 className="font-[family-name:var(--font-display)] text-2xl">
            Послуги та географія
          </h2>
          <div>
            <label className="mb-1 block text-sm text-ink-soft">
              Послуги (через кому)
            </label>
            <textarea
              rows={3}
              value={servicesText}
              onChange={(e) => setServicesText(e.target.value)}
              placeholder="Повний день, Love story, Другий фотограф, Дрон"
              className="w-full rounded-xl border border-line px-4 py-3 outline-none focus:border-sage"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-ink-soft">
                Зони виїзду
              </label>
              <input
                value={serviceAreasText}
                onChange={(e) => setServiceAreasText(e.target.value)}
                placeholder="Київ, область, вся Україна"
                className="w-full rounded-xl border border-line px-4 py-3 outline-none focus:border-sage"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-ink-soft">Мови</label>
              <input
                value={languagesText}
                onChange={(e) => setLanguagesText(e.target.value)}
                placeholder="українська, англійська"
                className="w-full rounded-xl border border-line px-4 py-3 outline-none focus:border-sage"
              />
            </div>
          </div>
        </section>

        <section id="pricing" className="scroll-mt-20 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-[family-name:var(--font-display)] text-2xl">
              Пакети
            </h2>
            <button
              type="button"
              onClick={() =>
                setPackages((prev) => [
                  ...prev,
                  {
                    title: "",
                    price: 0,
                    description: "",
                    includes: "",
                    duration: "",
                    isPopular: false,
                  },
                ])
              }
              className="rounded-full border border-line px-3 py-1.5 text-sm hover:border-sage/40"
            >
              + пакет
            </button>
          </div>
          {packages.length === 0 ? (
            <p className="text-sm text-ink-soft">Додай хоча б один пакет послуг.</p>
          ) : (
            packages.map((pkg, index) => (
              <div
                key={index}
                className="space-y-2 rounded-xl border border-line p-4"
              >
                <div className="grid gap-2 sm:grid-cols-[1fr_120px_auto]">
                  <input
                    value={pkg.title}
                    onChange={(e) =>
                      setPackages((prev) =>
                        prev.map((p, i) =>
                          i === index ? { ...p, title: e.target.value } : p,
                        ),
                      )
                    }
                    placeholder="Назва пакета"
                    className="rounded-xl border border-line px-3 py-2 outline-none focus:border-sage"
                  />
                  <input
                    type="number"
                    min={0}
                    value={pkg.price}
                    onChange={(e) =>
                      setPackages((prev) =>
                        prev.map((p, i) =>
                          i === index
                            ? { ...p, price: Number(e.target.value) }
                            : p,
                        ),
                      )
                    }
                    className="rounded-xl border border-line px-3 py-2 outline-none focus:border-sage"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setPackages((prev) => prev.filter((_, i) => i !== index))
                    }
                    className="text-sm text-red-700"
                  >
                    Видалити
                  </button>
                </div>
                <input
                  value={pkg.description}
                  onChange={(e) =>
                    setPackages((prev) =>
                      prev.map((p, i) =>
                        i === index
                          ? { ...p, description: e.target.value }
                          : p,
                      ),
                    )
                  }
                  placeholder="Короткий опис"
                  className="w-full rounded-xl border border-line px-3 py-2 outline-none focus:border-sage"
                />
                <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                  <input
                    value={pkg.duration}
                    onChange={(e) =>
                      setPackages((prev) =>
                        prev.map((p, i) =>
                          i === index ? { ...p, duration: e.target.value } : p,
                        ),
                      )
                    }
                    placeholder="Тривалість: 8 годин"
                    className="rounded-xl border border-line px-3 py-2 outline-none focus:border-sage"
                  />
                  <label className="flex items-center gap-2 rounded-xl border border-line px-3 py-2 text-sm text-ink">
                    <input
                      type="checkbox"
                      checked={pkg.isPopular}
                      onChange={(e) =>
                        setPackages((prev) =>
                          prev.map((p, i) =>
                            i === index
                              ? { ...p, isPopular: e.target.checked }
                              : { ...p, isPopular: false },
                          ),
                        )
                      }
                      className="accent-[var(--sage)]"
                    />
                    Популярний
                  </label>
                </div>
                <input
                  value={pkg.includes}
                  onChange={(e) =>
                    setPackages((prev) =>
                      prev.map((p, i) =>
                        i === index ? { ...p, includes: e.target.value } : p,
                      ),
                    )
                  }
                  placeholder="Що входить"
                  className="w-full rounded-xl border border-line px-3 py-2 outline-none focus:border-sage"
                />
              </div>
            ))
          )}
        </section>

        <section id="team" className="scroll-mt-20 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-[family-name:var(--font-display)] text-2xl">
              Команда
            </h2>
            <button
              type="button"
              onClick={() =>
                setTeam((prev) => [
                  ...prev,
                  { name: "", role: "", bio: "", photoUrl: "" },
                ])
              }
              className="rounded-full border border-line px-3 py-1.5 text-sm hover:border-sage/40"
            >
              + учасник
            </button>
          </div>
          {team.length === 0 ? (
            <p className="rounded-xl bg-mist px-4 py-3 text-sm text-ink-soft">
              Додай себе або команду — людям важливо бачити, кому вони довіряють день.
            </p>
          ) : null}
          {team.map((member, index) => (
            <div key={index} className="space-y-3 rounded-xl border border-line p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  value={member.name}
                  onChange={(e) =>
                    setTeam((prev) =>
                      prev.map((item, i) =>
                        i === index ? { ...item, name: e.target.value } : item,
                      ),
                    )
                  }
                  placeholder="Імʼя"
                  className="rounded-xl border border-line px-3 py-2 outline-none focus:border-sage"
                />
                <input
                  value={member.role}
                  onChange={(e) =>
                    setTeam((prev) =>
                      prev.map((item, i) =>
                        i === index ? { ...item, role: e.target.value } : item,
                      ),
                    )
                  }
                  placeholder="Роль: фотограф / засновниця"
                  className="rounded-xl border border-line px-3 py-2 outline-none focus:border-sage"
                />
              </div>
              <input
                value={member.photoUrl}
                onChange={(e) =>
                  setTeam((prev) =>
                    prev.map((item, i) =>
                      i === index ? { ...item, photoUrl: e.target.value } : item,
                    ),
                  )
                }
                placeholder="URL фото"
                className="w-full rounded-xl border border-line px-3 py-2 outline-none focus:border-sage"
              />
              <textarea
                rows={3}
                value={member.bio}
                onChange={(e) =>
                  setTeam((prev) =>
                    prev.map((item, i) =>
                      i === index ? { ...item, bio: e.target.value } : item,
                    ),
                  )
                }
                placeholder="Коротко про людину й досвід"
                className="w-full rounded-xl border border-line px-3 py-2 outline-none focus:border-sage"
              />
              <button
                type="button"
                onClick={() => setTeam((prev) => prev.filter((_, i) => i !== index))}
                className="text-sm text-red-700"
              >
                Видалити
              </button>
            </div>
          ))}
        </section>

        <section id="availability" className="scroll-mt-20 space-y-4">
          <h2 className="font-[family-name:var(--font-display)] text-2xl">
            Доступність і спецпропозиція
          </h2>
          <div>
            <label className="mb-1 block text-sm text-ink-soft">
              Що зараз із вільними датами
            </label>
            <textarea
              rows={3}
              value={availabilityNote}
              onChange={(e) => setAvailabilityNote(e.target.value)}
              placeholder="На 2027 рік відкриті бронювання. На осінь 2026 залишилось кілька дат."
              className="w-full rounded-xl border border-line px-4 py-3 outline-none focus:border-sage"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              value={dealTitle}
              onChange={(e) => setDealTitle(e.target.value)}
              placeholder="Назва акції / подарунка"
              className="rounded-xl border border-line px-4 py-3 outline-none focus:border-sage"
            />
            <input
              value={dealDescription}
              onChange={(e) => setDealDescription(e.target.value)}
              placeholder="Умови пропозиції"
              className="rounded-xl border border-line px-4 py-3 outline-none focus:border-sage"
            />
          </div>
        </section>

        <section id="faq" className="scroll-mt-20 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-[family-name:var(--font-display)] text-2xl">
              FAQ
            </h2>
            <button
              type="button"
              onClick={() =>
                setFaqs((prev) => [...prev, { question: "", answer: "" }])
              }
              className="rounded-full border border-line px-3 py-1.5 text-sm hover:border-sage/40"
            >
              + питання
            </button>
          </div>
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="space-y-2 rounded-xl border border-line p-4"
            >
              <input
                value={faq.question}
                onChange={(e) =>
                  setFaqs((prev) =>
                    prev.map((f, i) =>
                      i === index ? { ...f, question: e.target.value } : f,
                    ),
                  )
                }
                placeholder="Питання"
                className="w-full rounded-xl border border-line px-3 py-2 outline-none focus:border-sage"
              />
              <textarea
                value={faq.answer}
                onChange={(e) =>
                  setFaqs((prev) =>
                    prev.map((f, i) =>
                      i === index ? { ...f, answer: e.target.value } : f,
                    ),
                  )
                }
                placeholder="Відповідь"
                rows={2}
                className="w-full rounded-xl border border-line px-3 py-2 outline-none focus:border-sage"
              />
              <button
                type="button"
                onClick={() =>
                  setFaqs((prev) => prev.filter((_, i) => i !== index))
                }
                className="text-sm text-red-700"
              >
                Видалити
              </button>
            </div>
          ))}
        </section>

        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-sage px-5 py-3 text-sm font-semibold text-white hover:bg-sage-deep disabled:opacity-60"
        >
          {saving ? "Зберігаємо..." : "Зберегти профіль"}
        </button>
      </form>
    </>
  );
}

export function VendorProfilePage() {
  return (
    <RequireAuth roles={["VENDOR", "ADMIN"]}>
      <section className="bg-paper px-5 py-12 md:px-8">
        <div className="mx-auto max-w-6xl">
          <VendorProfileInner />
        </div>
      </section>
    </RequireAuth>
  );
}
