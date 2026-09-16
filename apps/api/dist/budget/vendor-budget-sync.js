"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncBudgetItemForExternalVendor = syncBudgetItemForExternalVendor;
exports.removeBudgetItemForExternalVendor = removeBudgetItemForExternalVendor;
exports.syncAllExternalVendorBudgetItems = syncAllExternalVendorBudgetItems;
const META_PREFIX = 'fata-vendor-meta:';
const USD_RATE = 41;
const EUR_RATE = 45;
function parseVendorMeta(notes) {
    if (!notes?.startsWith(META_PREFIX))
        return {};
    try {
        return JSON.parse(notes.slice(META_PREFIX.length));
    }
    catch {
        return {};
    }
}
function toUah(amount, currency = 'UAH') {
    if (!Number.isFinite(amount) || amount <= 0)
        return 0;
    if (currency === 'USD')
        return Math.round(amount * USD_RATE);
    if (currency === 'EUR')
        return Math.round(amount * EUR_RATE);
    return Math.round(amount);
}
function budgetCategoryForVendor(slug) {
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
            return 'vendors';
    }
}
function buildBudgetNotes(vendorName, currency) {
    return [
        'payer:couple',
        `currency:${currency}`,
        `vendor:${encodeURIComponent(vendorName)}`,
    ].join(' ');
}
async function syncBudgetItemForExternalVendor(prisma, userId, vendor) {
    const wedding = await prisma.wedding.findUnique({
        where: { userId },
        select: { id: true },
    });
    if (!wedding)
        return;
    const meta = parseVendorMeta(vendor.notes);
    const deposit = meta.deposit ?? 0;
    const balance = meta.balance ??
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
    const notesCurrency = (balance > 0 ? balanceCurrency : depositCurrency) === 'USD' ? 'USD' : 'UAH';
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
async function removeBudgetItemForExternalVendor(prisma, vendorId) {
    await prisma.budgetItem.deleteMany({
        where: { externalVendorId: vendorId },
    });
}
async function syncAllExternalVendorBudgetItems(prisma, userId) {
    const vendors = await prisma.externalVendor.findMany({
        where: { userId },
    });
    for (const vendor of vendors) {
        await syncBudgetItemForExternalVendor(prisma, userId, vendor);
    }
}
//# sourceMappingURL=vendor-budget-sync.js.map