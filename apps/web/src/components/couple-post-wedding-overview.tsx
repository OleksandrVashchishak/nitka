"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getBudget } from "@/lib/budget-api";
import {
  getDashboardInsights,
  getVendorPipeline,
  type DashboardInsights,
  type VendorPipeline,
  type Wedding,
} from "@/lib/dashboard-api";
import { CabinetNotificationsBell } from "@/components/cabinet-notifications";
import { CabinetProfileMenu } from "@/components/cabinet-profile-menu";
import { BrandLogo } from "@/components/brand-logo";
import {
  getNotificationsSummary,
  type NotificationsSummary,
} from "@/lib/notifications-api";

const USD_RATE = 41;

function formatMoneyUsd(uah: number) {
  const usd = Math.round(uah / USD_RATE);
  return `$${new Intl.NumberFormat("en-US").format(usd)}`;
}

function guestPhrase(n: number) {
  const abs = Math.abs(n) % 100;
  const d = abs % 10;
  if (abs > 10 && abs < 20) {
    return `${n} гостей відсвяткували з вами ваш день`;
  }
  if (d === 1) return `${n} гість відсвяткував з вами ваш день`;
  if (d >= 2 && d <= 4) {
    return `${n} гості відсвяткували з вами ваш день`;
  }
  return `${n} гостей відсвяткували з вами ваш день`;
}

function vendorPhrase(n: number) {
  const abs = Math.abs(n) % 100;
  const d = abs % 10;
  if (abs > 10 && abs < 20) {
    return `${n} підрядників зробили цей день можливим`;
  }
  if (d === 1) return `${n} підрядник зробив цей день можливим`;
  if (d >= 2 && d <= 4) {
    return `${n} підрядники зробили цей день можливим`;
  }
  return `${n} підрядників зробили цей день можливим`;
}

export function CouplePostWeddingOverview({
  wedding,
  partnerOneFirst,
  partnerTwoFirst,
  partnerInitials,
}: {
  wedding: Wedding;
  partnerOneFirst: string;
  partnerTwoFirst: string;
  partnerInitials: string;
}) {
  const [insights, setInsights] = useState<DashboardInsights | null>(null);
  const [summary, setSummary] = useState<NotificationsSummary | null>(null);
  const [pipeline, setPipeline] = useState<VendorPipeline | null>(null);
  const [spend, setSpend] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const [insightsData, summaryData, pipelineData, budgetData] =
          await Promise.all([
            getDashboardInsights(),
            getNotificationsSummary(),
            getVendorPipeline().catch(() => null),
            getBudget().catch(() => null),
          ]);
        if (cancelled) return;
        setInsights(insightsData);
        setSummary(summaryData);
        setPipeline(pipelineData);
        if (budgetData?.items?.length) {
          setSpend(
            budgetData.items.reduce(
              (total, item) => total + Math.max(item.actual, item.estimated),
              0,
            ),
          );
        } else if (insightsData) {
          setSpend(
            Math.max(insightsData.budget.actual, insightsData.budget.estimated),
          );
        } else {
          setSpend(0);
        }
      } catch {
        if (!cancelled) setSpend(0);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const guests =
    insights?.rsvp.yes ||
    insights?.rsvp.total ||
    wedding.guests ||
    0;
  const vendors =
    pipeline?.manual.length ??
    insights?.pipeline.total ??
    0;
  const spendValue = spend ?? 0;
  const coupleNames = [partnerOneFirst, partnerTwoFirst]
    .map((name) => name.trim())
    .filter(Boolean)
    .join(" та ");
  const headline = coupleNames
    ? `${coupleNames}, вітаємо Вас з одруженням!`
    : "Вітаємо Вас з одруженням!";
  const photo = wedding.couplePhotoUrl || "/cabinet/post-wedding.jpg";

  return (
    <div className="cabinet-overview cabinet-overview--post">
      <div className="cabinet-overview-top">
        <BrandLogo href="/dashboard" className="cabinet-mobile-brand" />
        <div className="cabinet-overview-greeting">
          <h1>Ви це зробили!</h1>
        </div>
        <div className="cabinet-overview-actions">
          <CabinetNotificationsBell summary={summary} />
          <CabinetProfileMenu initials={partnerInitials} />
        </div>
      </div>

      <div className="cabinet-post">
        <h2 className="cabinet-post-title">{headline}</h2>

        <div className="cabinet-post-photo">
          <Image
            src={photo}
            alt="Весільне фото"
            fill
            className="object-cover"
            sizes="(max-width: 1100px) 100vw, 1072px"
            priority
          />
        </div>

        <div className="cabinet-post-stats">
          <article className="cabinet-post-card">
            <p className="cabinet-post-card-label">Гості</p>
            <p className="cabinet-post-card-text">{guestPhrase(guests)}</p>
          </article>
          <article className="cabinet-post-card">
            <p className="cabinet-post-card-label">Підрядники</p>
            <p className="cabinet-post-card-text">{vendorPhrase(vendors)}</p>
          </article>
          <article className="cabinet-post-card">
            <p className="cabinet-post-card-label">Бюджет</p>
            <p className="cabinet-post-card-text">
              {formatMoneyUsd(spendValue)} - фінальний бюджет, давайте підрахуємо
              окупність
            </p>
          </article>
        </div>

        <p className="cabinet-post-thanks">
          Дякуємо, що обрали fata.studio для планування вашого весілля. Бажаємо
          вам щастя та любові!
        </p>

        <div className="cabinet-post-actions">
          <a
            className="cabinet-post-btn cabinet-post-btn--ink"
            href="mailto:hello@fata.studio?subject=%D0%92%D1%96%D0%B4%D0%B3%D1%83%D0%BA%20%D0%BF%D1%80%D0%BE%20fata.studio"
          >
            Залишити відгук
          </a>
          <Link
            href="/budget"
            className="cabinet-post-btn cabinet-post-btn--lime"
          >
            Порахувати окупність
          </Link>
        </div>
      </div>
    </div>
  );
}
