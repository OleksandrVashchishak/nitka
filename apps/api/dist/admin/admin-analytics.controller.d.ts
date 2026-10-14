import { AdminAnalyticsService } from './admin-analytics.service';
import { CreateAdminNoteDto } from './dto/admin-note.dto';
export declare class AdminAnalyticsController {
    private readonly analytics;
    constructor(analytics: AdminAnalyticsService);
    getStats(): Promise<{
        generatedAt: string;
        users: {
            total: number;
            last7d: number;
            last30d: number;
            emptyAccounts: number;
            active14d: number;
            inactive14d: number;
            neverLoggedIn: number;
        };
        weddings: {
            total: number;
            withPartner: number;
        };
        features: {
            guests: number;
            budget: number;
            tasks: number;
            vendors: number;
            dayPlan: number;
            seating: number;
            publishedWebsite: number;
            invitation: number;
            website: number;
        };
        engagement: {
            rsvpResponded: number;
            pushDevices: number;
        };
        funnel: {
            registered: number;
            withWedding: number;
            withGuests: number;
            withBudget: number;
            withWebsite: number;
            withPublished: number;
            ofRegistered: {
                withWedding: number;
                withGuests: number;
                withBudget: number;
                withWebsite: number;
                withPublished: number;
            };
            ofWeddings: {
                withGuests: number;
                withBudget: number;
                withWebsite: number;
                withPublished: number;
            };
            stepConversion: {
                weddingToGuests: number;
                guestsToBudget: number;
                budgetToWebsite: number;
                websiteToPublished: number;
            };
        };
        dropoff: {
            guestsNoBudget: number;
            budgetNoWebsite: number;
            websiteNotPublished: number;
            dayPlanNoSeating: number;
            guestsNoSeating: number;
            tasksNoBudget: number;
            guestsNoDayPlan: number;
        };
    }>;
    listUsers(q?: string, page?: number, limit?: number, city?: string, planningStage?: string, dateFrom?: string, dateTo?: string, activity?: string): Promise<{
        page: number;
        limit: number;
        total: number;
        items: {
            id: string;
            email: string;
            name: string;
            role: import(".prisma/client").$Enums.Role;
            blocked: boolean;
            createdAt: Date;
            lastLoginAt: Date | null;
            hasActiveSession: boolean;
            isPartnerOnly: boolean;
            notesCount: number;
            wedding: {
                id: string;
                city: string;
                date: Date;
                guestsPlan: number;
                budgetPlan: number;
                planningStage: string;
                guestsCount: number;
                budgetItemsCount: number;
                tasksCount: number;
                partnersCount: number;
                hasDayPlan: boolean;
                hasSeating: boolean;
                websitePublished: boolean;
                websiteSlug: string | null;
                hasInvitation: boolean;
            } | null;
            vendorsCount: number;
            pushDevicesCount: number;
        }[];
    }>;
    getUser(id: string): Promise<{
        id: string;
        email: string;
        name: string;
        role: import(".prisma/client").$Enums.Role;
        blocked: boolean;
        createdAt: Date;
        lastLoginAt: Date | null;
        hasActiveSession: boolean;
        notes: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            body: string;
        }[];
        notifications: {
            guestRsvp: boolean;
            upcomingPayments: boolean;
            taskDeadlines: boolean;
            partnerChanges: boolean;
            push: boolean;
            email: boolean;
        };
        pushDevices: {
            platform: string;
            updatedAt: Date;
        }[];
        vendors: {
            total: number;
            byStage: Record<string, number>;
        };
        partnerMembership: {
            role: import(".prisma/client").$Enums.WeddingMemberRole;
            weddingId: string;
            owner: {
                email: string;
                name: string;
                id: string;
            };
            city: string;
            date: Date;
        } | null;
        wedding: {
            id: string;
            city: string;
            date: Date;
            guestsPlan: number;
            budgetPlan: number;
            partnerOneName: string;
            partnerTwoName: string;
            planningStage: string;
            cityUndecided: boolean;
            guestsUndecided: boolean;
            hasDayPlan: boolean;
            hasVendorPlan: boolean;
            hasSeating: boolean;
            guests: {
                total: number;
                rsvp: {
                    PENDING: number;
                    YES: number;
                    NO: number;
                    MAYBE: number;
                };
            };
            budget: {
                items: number;
                estimated: number;
                actual: number;
                paidItems: number;
            };
            tasks: {
                total: number;
                byStatus: {
                    TODO: number;
                    IN_PROGRESS: number;
                    DONE: number;
                };
            };
            members: {
                user: {
                    email: string;
                    name: string;
                    id: string;
                };
                role: import(".prisma/client").$Enums.WeddingMemberRole;
            }[];
            recentInvites: {
                createdAt: Date;
                expiresAt: Date;
                acceptedAt: Date | null;
            }[];
            website: {
                updatedAt: Date;
                slug: string;
                publishedAt: Date | null;
                templateId: string;
                published: boolean;
            } | null;
            invitation: {
                updatedAt: Date;
                templateId: string;
            } | null;
        } | null;
    }>;
    addNote(id: string, dto: CreateAdminNoteDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        body: string;
    }>;
    deleteNote(id: string, noteId: string): Promise<{
        ok: boolean;
    }>;
}
