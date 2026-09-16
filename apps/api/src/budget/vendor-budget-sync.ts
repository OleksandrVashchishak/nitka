import type { ExternalVendor, PrismaClient } from '@prisma/client';

const META_PREFIX = 'fata-vendor-meta:';
/**
 * TODO(fx): replace hardcoded rates with weekly NBU USD→UAH fetch.
 * Free, no API key:
 *   GET https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?valcode=USD&json
 * Response: [{ rate, cc: "USD", exchangedate }] — store `rate`, refresh ~1×/week (cron).
 * Keep EUR separate or derive later; for now sync + budget UI must use the same source.
 */
const USD_RATE = 41;
const EUR_RATE = 45;

type VendorCurrency = 'UAH' | 'USD' | 'EUR';

type VendorMeta = {
  deposit?: number | null;
  depositCurrency?: VendorCurrency;
  balance?: number | null;
  balanceCurrency?: VendorCurrency;
};

function parseVendorMeta(notes: string | null | undefined): VendorMeta {
  if (!notes?.startsWith(META_PREFIX)) return {};
  try {
    return JSON.parse(notes.slice(META_PREFIX.length)) as VendorMeta;
  } catch {
    return {};
  }
}

function toUah(amount: number, currency: VendorCurrency = 'UAH') {
  if (!Number.isFinite(amount) || amount <= 0) return 0;
  if (currency === 'USD') return Math.round(amount * USD_RATE);
  if (currency === 'EUR') return Math.round(amount * EUR_RATE);
  return Math.round(amount);
}

function budgetCategoryForVendor(slug: string) {
  switch (slug) {
    case 'attire':
    case 'rings':
      return 'attire';
    case 'decor':
    case 'florist':
      return 'decor';
    case 'catering':
    case 'cake':
    case 'pastry':
    case 'candybar':
      return 'banquet';
    case 'docs':
    case 'gifts':
    case 'invitations':
    case 'print':
      return 'print';
    case 'band':
    case 'dj':
      return 'music';
    case 'hair':
    case 'makeup':
      return 'beauty';
    case 'other':
    case 'honeymoon':
    case 'reserve':
      return 'other';
    default:
      // venue, host, photo, video, planner, transport, …
      return 'vendors';
  }
}

function buildBudgetNotes(vendorName: string, currency: VendorCurrency) {
  return [
    'payer:couple',
    `currency:${currency}`,
    `vendor:${encodeURIComponent(vendorName)}`,
  ].join(' ');
}

/** Upsert / remove budget row linked to an external vendor. */
export async function syncBudgetItemForExternalVendor(
  prisma: PrismaClient,
  userId: string,
  vendor: ExternalVendor,
) {
  const wedding = await prisma.wedding.findUnique({
    where: { userId },
    select: { id: true },
  });
  if (!wedding) return;

  const meta = parseVendorMeta(vendor.notes);
  const deposit = meta.deposit ?? 0;
  const balance =
    meta.balance ??
    (vendor.quotedPrice != null ? vendor.quotedPrice : 0);
  const depositCurrency = meta.depositCurrency ?? 'UAH';
  const balanceCurrency = meta.balanceCurrency ?? 'UAH';
  const depositUah = toUah(deposit, depositCurrency);
  const balanceUah = toUah(balance, balanceCurrency);
  const total = depositUah + balanceUah;
  const hasMoney = total > 0;
  const shouldSync = vendor.stage === 'CHOSEN' || hasMoney;

  const existing = await prisma.budgetItem.findFirst({
    where: { externalVendorId: vendor.id },
    select: { id: true },
  });

  if (!shouldSync) {
    if (existing) {
      await prisma.budgetItem.delete({ where: { id: existing.id } });
    }
    return;
  }

  const fullyPaid = hasMoney && balanceUah <= 0;
  const notesCurrency: VendorCurrency =
    (balance > 0 ? balanceCurrency : depositCurrency) === 'USD' ? 'USD' : 'UAH';
  const payload = {
    category: budgetCategoryForVendor(vendor.category),
    title: vendor.name.trim() || 'Підрядник',
    estimated: total,
    actual: fullyPaid ? total : depositUah,
    paid: fullyPaid,
    notes: buildBudgetNotes(vendor.name.trim() || 'Підрядник', notesCurrency),
    externalVendorId: vendor.id,
  };

  if (existing) {
    await prisma.budgetItem.update({
      where: { id: existing.id },
      data: payload,
    });
    return;
  }

  await prisma.budgetItem.create({
    data: {
      weddingId: wedding.id,
      ...payload,
    },
  });
}

export async function removeBudgetItemForExternalVendor(
  prisma: PrismaClient,
  vendorId: string,
) {
  await prisma.budgetItem.deleteMany({
    where: { externalVendorId: vendorId },
  });
}

/** Backfill linked budget rows for all of the user's external vendors. */
export async function syncAllExternalVendorBudgetItems(
  prisma: PrismaClient,
  userId: string,
) {
  const vendors = await prisma.externalVendor.findMany({
    where: { userId },
  });
  for (const vendor of vendors) {
    await syncBudgetItemForExternalVendor(prisma, userId, vendor);
  }
}
