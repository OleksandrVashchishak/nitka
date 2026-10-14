"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminAnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
function daysAgo(days) {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d;
}
function isNonEmptyJson(value) {
    if (value == null)
        return false;
    if (Array.isArray(value))
        return value.length > 0;
    if (typeof value === 'object')
        return Object.keys(value).length > 0;
    return true;
}
function pct(part, whole) {
    if (!whole)
        return 0;
    return Math.round((part / whole) * 1000) / 10;
}
let AdminAnalyticsService = class AdminAnalyticsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getStats() {
        const now = new Date();
        const d7 = daysAgo(7);
        const d14 = daysAgo(14);
        const d30 = daysAgo(30);
        const [usersTotal, users7d, users30d, weddingsTotal, weddingsWithPartner, withGuests, withBudget, withTasks, withVendors, withDayPlan, withSeating, withPublishedWebsite, withInvitation, withWebsiteAny, rsvpResponded, pushDevices, emptyAccounts, active14d, neverLoggedIn, inactive14d, dropoff,] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.user.count({ where: { createdAt: { gte: d7 } } }),
            this.prisma.user.count({ where: { createdAt: { gte: d30 } } }),
            this.prisma.wedding.count(),
            this.prisma.wedding.count({ where: { members: { some: {} } } }),
            this.prisma.wedding.count({ where: { guestList: { some: {} } } }),
            this.prisma.wedding.count({ where: { budgetItems: { some: {} } } }),
            this.prisma.wedding.count({ where: { tasks: { some: {} } } }),
            this.prisma.user.count({ where: { externalVendors: { some: {} } } }),
            this.countWeddingsWithDayPlan(),
            this.countWeddingsWithSeating(),
            this.prisma.weddingWebsite.count({ where: { published: true } }),
            this.prisma.weddingInvitation.count(),
            this.prisma.weddingWebsite.count(),
            this.prisma.guest.count({
                where: { rsvpStatus: { not: 'PENDING' } },
            }),
            this.prisma.pushDevice.count(),
            this.prisma.user.count({
                where: {
                    wedding: null,
                    weddingMember: null,
                    externalVendors: { none: {} },
                },
            }),
            this.prisma.user.count({
                where: { lastLoginAt: { gte: d14 } },
            }),
            this.prisma.user.count({
                where: { lastLoginAt: null },
            }),
            this.prisma.user.count({
                where: {
                    createdAt: { lt: d14 },
                    OR: [{ lastLoginAt: null }, { lastLoginAt: { lt: d14 } }],
                },
            }),
            this.getDropoffCounts(),
        ]);
        const funnelBase = weddingsTotal || 1;
        const funnel = {
            registered: usersTotal,
            withWedding: weddingsTotal,
            withGuests,
            withBudget,
            withWebsite: withWebsiteAny,
            withPublished: withPublishedWebsite,
            ofRegistered: {
                withWedding: pct(weddingsTotal, usersTotal),
                withGuests: pct(withGuests, usersTotal),
                withBudget: pct(withBudget, usersTotal),
                withWebsite: pct(withWebsiteAny, usersTotal),
                withPublished: pct(withPublishedWebsite, usersTotal),
            },
            ofWeddings: {
                withGuests: pct(withGuests, funnelBase),
                withBudget: pct(withBudget, funnelBase),
                withWebsite: pct(withWebsiteAny, funnelBase),
                withPublished: pct(withPublishedWebsite, funnelBase),
            },
            stepConversion: {
                weddingToGuests: pct(withGuests, weddingsTotal),
                guestsToBudget: pct(withBudget, withGuests),
                budgetToWebsite: pct(withWebsiteAny, withBudget),
                websiteToPublished: pct(withPublishedWebsite, withWebsiteAny),
            },
        };
        return {
            generatedAt: now.toISOString(),
            users: {
                total: usersTotal,
                last7d: users7d,
                last30d: users30d,
                emptyAccounts,
                active14d,
                inactive14d,
                neverLoggedIn,
            },
            weddings: {
                total: weddingsTotal,
                withPartner: weddingsWithPartner,
            },
            features: {
                guests: withGuests,
                budget: withBudget,
                tasks: withTasks,
                vendors: withVendors,
                dayPlan: withDayPlan,
                seating: withSeating,
                publishedWebsite: withPublishedWebsite,
                invitation: withInvitation,
                website: withWebsiteAny,
            },
            engagement: {
                rsvpResponded,
                pushDevices,
            },
            funnel,
            dropoff,
        };
    }
    async getDropoffCounts() {
        const rows = await this.prisma.$queryRaw `
      SELECT
        COUNT(*) FILTER (
          WHERE EXISTS (SELECT 1 FROM guests g WHERE g.wedding_id = w.id)
            AND NOT EXISTS (SELECT 1 FROM budget_items b WHERE b.wedding_id = w.id)
        )::bigint AS guests_no_budget,
        COUNT(*) FILTER (
          WHERE EXISTS (SELECT 1 FROM budget_items b WHERE b.wedding_id = w.id)
            AND NOT EXISTS (SELECT 1 FROM wedding_websites ww WHERE ww.wedding_id = w.id)
        )::bigint AS budget_no_website,
        COUNT(*) FILTER (
          WHERE EXISTS (
            SELECT 1 FROM wedding_websites ww
            WHERE ww.wedding_id = w.id AND ww.published = false
          )
        )::bigint AS website_not_published,
        COUNT(*) FILTER (
          WHERE w.day_plan IS NOT NULL
            AND w.day_plan::text NOT IN ('null', '{}', '[]')
            AND (
              (w.seating_draft IS NULL OR w.seating_draft::text IN ('null', '{}', '[]'))
              AND (w.seating_plan IS NULL OR w.seating_plan::text IN ('null', '{}', '[]'))
            )
        )::bigint AS dayplan_no_seating,
        COUNT(*) FILTER (
          WHERE EXISTS (SELECT 1 FROM guests g WHERE g.wedding_id = w.id)
            AND (
              (w.seating_draft IS NULL OR w.seating_draft::text IN ('null', '{}', '[]'))
              AND (w.seating_plan IS NULL OR w.seating_plan::text IN ('null', '{}', '[]'))
            )
        )::bigint AS guests_no_seating,
        COUNT(*) FILTER (
          WHERE EXISTS (SELECT 1 FROM tasks t WHERE t.wedding_id = w.id)
            AND NOT EXISTS (SELECT 1 FROM budget_items b WHERE b.wedding_id = w.id)
        )::bigint AS tasks_no_budget,
        COUNT(*) FILTER (
          WHERE EXISTS (SELECT 1 FROM guests g WHERE g.wedding_id = w.id)
            AND (
              w.day_plan IS NULL
              OR w.day_plan::text IN ('null', '{}', '[]')
            )
        )::bigint AS guests_no_dayplan
      FROM weddings w
    `;
        const r = rows[0];
        return {
            guestsNoBudget: Number(r?.guests_no_budget ?? 0),
            budgetNoWebsite: Number(r?.budget_no_website ?? 0),
            websiteNotPublished: Number(r?.website_not_published ?? 0),
            dayPlanNoSeating: Number(r?.dayplan_no_seating ?? 0),
            guestsNoSeating: Number(r?.guests_no_seating ?? 0),
            tasksNoBudget: Number(r?.tasks_no_budget ?? 0),
            guestsNoDayPlan: Number(r?.guests_no_dayplan ?? 0),
        };
    }
    async countWeddingsWithDayPlan() {
        const rows = await this.prisma.$queryRaw `
      SELECT COUNT(*)::bigint AS count
      FROM weddings
      WHERE day_plan IS NOT NULL
        AND day_plan::text NOT IN ('null', '{}', '[]')
    `;
        return Number(rows[0]?.count ?? 0);
    }
    async countWeddingsWithSeating() {
        const rows = await this.prisma.$queryRaw `
      SELECT COUNT(*)::bigint AS count
      FROM weddings
      WHERE (
        seating_draft IS NOT NULL
        AND seating_draft::text NOT IN ('null', '{}', '[]')
      ) OR (
        seating_plan IS NOT NULL
        AND seating_plan::text NOT IN ('null', '{}', '[]')
      )
    `;
        return Number(rows[0]?.count ?? 0);
    }
    async listUsers(query) {
        const page = Math.max(1, query.page ?? 1);
        const limit = Math.min(100, Math.max(1, query.limit ?? 25));
        const skip = (page - 1) * limit;
        const q = query.q?.trim();
        const city = query.city?.trim();
        const planningStage = query.planningStage?.trim();
        const d14 = daysAgo(14);
        const and = [];
        if (q) {
            and.push({
                OR: [
                    { email: { contains: q, mode: 'insensitive' } },
                    { name: { contains: q, mode: 'insensitive' } },
                ],
            });
        }
        const weddingFilter = {};
        if (city) {
            weddingFilter.city = { contains: city, mode: 'insensitive' };
        }
        if (planningStage) {
            weddingFilter.planningStage = planningStage;
        }
        if (query.dateFrom || query.dateTo) {
            weddingFilter.date = {};
            if (query.dateFrom) {
                const from = new Date(query.dateFrom);
                if (Number.isNaN(from.getTime())) {
                    throw new common_1.BadRequestException('Невірна дата dateFrom');
                }
                weddingFilter.date.gte = from;
            }
            if (query.dateTo) {
                const to = new Date(query.dateTo);
                if (Number.isNaN(to.getTime())) {
                    throw new common_1.BadRequestException('Невірна дата dateTo');
                }
                weddingFilter.date.lte = to;
            }
        }
        if (Object.keys(weddingFilter).length > 0) {
            and.push({ wedding: weddingFilter });
        }
        if (query.activity === 'active') {
            and.push({ lastLoginAt: { gte: d14 } });
        }
        else if (query.activity === 'inactive') {
            and.push({
                createdAt: { lt: d14 },
                OR: [{ lastLoginAt: null }, { lastLoginAt: { lt: d14 } }],
            });
        }
        else if (query.activity === 'never') {
            and.push({ lastLoginAt: null });
        }
        else if (query.activity === 'empty') {
            and.push({
                wedding: null,
                weddingMember: null,
                externalVendors: { none: {} },
            });
        }
        const where = and.length ? { AND: and } : {};
        const [total, users] = await Promise.all([
            this.prisma.user.count({ where }),
            this.prisma.user.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    blocked: true,
                    createdAt: true,
                    lastLoginAt: true,
                    refreshTokenHash: true,
                    wedding: {
                        select: {
                            id: true,
                            city: true,
                            date: true,
                            guests: true,
                            budget: true,
                            planningStage: true,
                            dayPlan: true,
                            seatingDraft: true,
                            seatingPlan: true,
                            _count: {
                                select: {
                                    guestList: true,
                                    budgetItems: true,
                                    tasks: true,
                                    members: true,
                                },
                            },
                            website: {
                                select: { published: true, slug: true },
                            },
                            invitation: { select: { id: true } },
                        },
                    },
                    weddingMember: {
                        select: {
                            role: true,
                            weddingId: true,
                        },
                    },
                    _count: {
                        select: {
                            externalVendors: true,
                            pushDevices: true,
                            adminNotes: true,
                        },
                    },
                },
            }),
        ]);
        return {
            page,
            limit,
            total,
            items: users.map((u) => {
                const w = u.wedding;
                return {
                    id: u.id,
                    email: u.email,
                    name: u.name,
                    role: u.role,
                    blocked: u.blocked,
                    createdAt: u.createdAt,
                    lastLoginAt: u.lastLoginAt,
                    hasActiveSession: Boolean(u.refreshTokenHash),
                    isPartnerOnly: !u.wedding && Boolean(u.weddingMember),
                    notesCount: u._count.adminNotes,
                    wedding: w
                        ? {
                            id: w.id,
                            city: w.city,
                            date: w.date,
                            guestsPlan: w.guests,
                            budgetPlan: w.budget,
                            planningStage: w.planningStage,
                            guestsCount: w._count.guestList,
                            budgetItemsCount: w._count.budgetItems,
                            tasksCount: w._count.tasks,
                            partnersCount: w._count.members,
                            hasDayPlan: isNonEmptyJson(w.dayPlan),
                            hasSeating: isNonEmptyJson(w.seatingDraft) ||
                                isNonEmptyJson(w.seatingPlan),
                            websitePublished: w.website?.published ?? false,
                            websiteSlug: w.website?.slug ?? null,
                            hasInvitation: Boolean(w.invitation),
                        }
                        : null,
                    vendorsCount: u._count.externalVendors,
                    pushDevicesCount: u._count.pushDevices,
                };
            }),
        };
    }
    async getUser(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                blocked: true,
                createdAt: true,
                lastLoginAt: true,
                refreshTokenHash: true,
                notifGuestRsvp: true,
                notifUpcomingPayments: true,
                notifTaskDeadlines: true,
                notifPartnerChanges: true,
                notifPush: true,
                notifEmail: true,
                adminNotes: {
                    orderBy: { createdAt: 'desc' },
                    select: {
                        id: true,
                        body: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                },
                wedding: {
                    select: {
                        id: true,
                        city: true,
                        date: true,
                        guests: true,
                        budget: true,
                        partnerOneName: true,
                        partnerTwoName: true,
                        planningStage: true,
                        cityUndecided: true,
                        guestsUndecided: true,
                        dayPlan: true,
                        vendorPlan: true,
                        seatingDraft: true,
                        seatingPlan: true,
                        guestList: {
                            select: {
                                rsvpStatus: true,
                                respondedAt: true,
                            },
                        },
                        budgetItems: {
                            select: {
                                estimated: true,
                                actual: true,
                                paid: true,
                            },
                        },
                        tasks: {
                            select: {
                                status: true,
                            },
                        },
                        members: {
                            select: {
                                role: true,
                                user: { select: { id: true, email: true, name: true } },
                            },
                        },
                        invites: {
                            select: {
                                createdAt: true,
                                acceptedAt: true,
                                expiresAt: true,
                            },
                            orderBy: { createdAt: 'desc' },
                            take: 5,
                        },
                        website: {
                            select: {
                                slug: true,
                                published: true,
                                publishedAt: true,
                                templateId: true,
                                updatedAt: true,
                            },
                        },
                        invitation: {
                            select: {
                                templateId: true,
                                updatedAt: true,
                            },
                        },
                    },
                },
                weddingMember: {
                    select: {
                        role: true,
                        weddingId: true,
                        wedding: {
                            select: {
                                id: true,
                                city: true,
                                date: true,
                                user: { select: { id: true, email: true, name: true } },
                            },
                        },
                    },
                },
                externalVendors: {
                    select: {
                        stage: true,
                    },
                },
                pushDevices: {
                    select: {
                        platform: true,
                        updatedAt: true,
                    },
                },
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('Користувача не знайдено');
        }
        const w = user.wedding;
        const rsvp = { PENDING: 0, YES: 0, NO: 0, MAYBE: 0 };
        let budgetEstimated = 0;
        let budgetActual = 0;
        let budgetPaid = 0;
        const tasks = { TODO: 0, IN_PROGRESS: 0, DONE: 0 };
        const vendorStages = {};
        if (w) {
            for (const g of w.guestList) {
                rsvp[g.rsvpStatus] += 1;
            }
            for (const b of w.budgetItems) {
                budgetEstimated += b.estimated;
                budgetActual += b.actual;
                if (b.paid)
                    budgetPaid += 1;
            }
            for (const t of w.tasks) {
                tasks[t.status] += 1;
            }
        }
        for (const v of user.externalVendors) {
            vendorStages[v.stage] = (vendorStages[v.stage] ?? 0) + 1;
        }
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            blocked: user.blocked,
            createdAt: user.createdAt,
            lastLoginAt: user.lastLoginAt,
            hasActiveSession: Boolean(user.refreshTokenHash),
            notes: user.adminNotes,
            notifications: {
                guestRsvp: user.notifGuestRsvp,
                upcomingPayments: user.notifUpcomingPayments,
                taskDeadlines: user.notifTaskDeadlines,
                partnerChanges: user.notifPartnerChanges,
                push: user.notifPush,
                email: user.notifEmail,
            },
            pushDevices: user.pushDevices,
            vendors: {
                total: user.externalVendors.length,
                byStage: vendorStages,
            },
            partnerMembership: user.weddingMember
                ? {
                    role: user.weddingMember.role,
                    weddingId: user.weddingMember.weddingId,
                    owner: user.weddingMember.wedding.user,
                    city: user.weddingMember.wedding.city,
                    date: user.weddingMember.wedding.date,
                }
                : null,
            wedding: w
                ? {
                    id: w.id,
                    city: w.city,
                    date: w.date,
                    guestsPlan: w.guests,
                    budgetPlan: w.budget,
                    partnerOneName: w.partnerOneName,
                    partnerTwoName: w.partnerTwoName,
                    planningStage: w.planningStage,
                    cityUndecided: w.cityUndecided,
                    guestsUndecided: w.guestsUndecided,
                    hasDayPlan: isNonEmptyJson(w.dayPlan),
                    hasVendorPlan: isNonEmptyJson(w.vendorPlan),
                    hasSeating: isNonEmptyJson(w.seatingDraft) || isNonEmptyJson(w.seatingPlan),
                    guests: {
                        total: w.guestList.length,
                        rsvp,
                    },
                    budget: {
                        items: w.budgetItems.length,
                        estimated: budgetEstimated,
                        actual: budgetActual,
                        paidItems: budgetPaid,
                    },
                    tasks: {
                        total: w.tasks.length,
                        byStatus: tasks,
                    },
                    members: w.members,
                    recentInvites: w.invites,
                    website: w.website,
                    invitation: w.invitation,
                }
                : null,
        };
    }
    async addNote(userId, body) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { id: true },
        });
        if (!user) {
            throw new common_1.NotFoundException('Користувача не знайдено');
        }
        return this.prisma.adminUserNote.create({
            data: {
                userId,
                body: body.trim(),
            },
            select: {
                id: true,
                body: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }
    async deleteNote(userId, noteId) {
        const note = await this.prisma.adminUserNote.findFirst({
            where: { id: noteId, userId },
        });
        if (!note) {
            throw new common_1.NotFoundException('Нотатку не знайдено');
        }
        await this.prisma.adminUserNote.delete({ where: { id: noteId } });
        return { ok: true };
    }
};
exports.AdminAnalyticsService = AdminAnalyticsService;
exports.AdminAnalyticsService = AdminAnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminAnalyticsService);
//# sourceMappingURL=admin-analytics.service.js.map