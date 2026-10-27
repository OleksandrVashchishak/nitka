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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminAnalyticsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const contact_service_1 = require("../contact/contact.service");
const admin_analytics_service_1 = require("./admin-analytics.service");
const admin_insights_service_1 = require("./admin-insights.service");
const admin_websites_service_1 = require("./admin-websites.service");
const admin_contact_dto_1 = require("./dto/admin-contact.dto");
const admin_note_dto_1 = require("./dto/admin-note.dto");
const admin_website_dto_1 = require("./dto/admin-website.dto");
const superadmin_guard_1 = require("./superadmin.guard");
let AdminAnalyticsController = class AdminAnalyticsController {
    constructor(analytics, insights, websites, contact) {
        this.analytics = analytics;
        this.insights = insights;
        this.websites = websites;
        this.contact = contact;
    }
    getStats() {
        return this.analytics.getStats();
    }
    listUsers(q, page, limit, city, planningStage, dateFrom, dateTo, activity) {
        return this.analytics.listUsers({
            q,
            page,
            limit,
            city,
            planningStage,
            dateFrom,
            dateTo,
            activity,
        });
    }
    getUser(id) {
        return this.analytics.getUser(id);
    }
    addNote(id, dto) {
        return this.analytics.addNote(id, dto.body);
    }
    deleteNote(id, noteId) {
        return this.analytics.deleteNote(id, noteId);
    }
    listContactMessages(page, limit) {
        return this.contact.list({ page, limit });
    }
    markContactRead(id) {
        return this.contact.markRead(id);
    }
    setContactStatus(id, dto) {
        return this.contact.setStatus(id, dto.status);
    }
    replyContact(id, dto) {
        return this.contact.reply(id, dto.body);
    }
    getTimeseries(granularity = 'day', periods) {
        return this.insights.getTimeseries(granularity, periods || undefined);
    }
    getCohorts(weeks) {
        return this.insights.getCohorts(weeks || undefined);
    }
    listWebsites(q, status, page, limit) {
        return this.websites.list({ q, status, page, limit });
    }
    setWebsiteHidden(id, dto) {
        return this.websites.setHidden(id, dto.hidden);
    }
    deleteWebsite(id) {
        return this.websites.remove(id);
    }
    deleteContactMessage(id) {
        return this.contact.remove(id);
    }
};
exports.AdminAnalyticsController = AdminAnalyticsController;
__decorate([
    (0, common_1.Get)('stats'),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminAnalyticsController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('users'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('q')),
    __param(1, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(25), common_1.ParseIntPipe)),
    __param(3, (0, common_1.Query)('city')),
    __param(4, (0, common_1.Query)('planningStage')),
    __param(5, (0, common_1.Query)('dateFrom')),
    __param(6, (0, common_1.Query)('dateTo')),
    __param(7, (0, common_1.Query)('activity')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], AdminAnalyticsController.prototype, "listUsers", null);
__decorate([
    (0, common_1.Get)('users/:id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminAnalyticsController.prototype, "getUser", null);
__decorate([
    (0, common_1.Post)('users/:id/notes'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, admin_note_dto_1.CreateAdminNoteDto]),
    __metadata("design:returntype", void 0)
], AdminAnalyticsController.prototype, "addNote", null);
__decorate([
    (0, common_1.Delete)('users/:id/notes/:noteId'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('noteId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AdminAnalyticsController.prototype, "deleteNote", null);
__decorate([
    (0, common_1.Get)('contact-messages'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(50), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], AdminAnalyticsController.prototype, "listContactMessages", null);
__decorate([
    (0, common_1.Patch)('contact-messages/:id/read'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminAnalyticsController.prototype, "markContactRead", null);
__decorate([
    (0, common_1.Patch)('contact-messages/:id/status'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, admin_contact_dto_1.UpdateContactStatusDto]),
    __metadata("design:returntype", void 0)
], AdminAnalyticsController.prototype, "setContactStatus", null);
__decorate([
    (0, common_1.Post)('contact-messages/:id/reply'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, admin_contact_dto_1.ReplyContactDto]),
    __metadata("design:returntype", void 0)
], AdminAnalyticsController.prototype, "replyContact", null);
__decorate([
    (0, common_1.Get)('timeseries'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('granularity')),
    __param(1, (0, common_1.Query)('periods', new common_1.DefaultValuePipe(0), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], AdminAnalyticsController.prototype, "getTimeseries", null);
__decorate([
    (0, common_1.Get)('cohorts'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('weeks', new common_1.DefaultValuePipe(0), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AdminAnalyticsController.prototype, "getCohorts", null);
__decorate([
    (0, common_1.Get)('websites'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('q')),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(3, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(25), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number, Number]),
    __metadata("design:returntype", void 0)
], AdminAnalyticsController.prototype, "listWebsites", null);
__decorate([
    (0, common_1.Patch)('websites/:id/hidden'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, admin_website_dto_1.SetWebsiteHiddenDto]),
    __metadata("design:returntype", void 0)
], AdminAnalyticsController.prototype, "setWebsiteHidden", null);
__decorate([
    (0, common_1.Delete)('websites/:id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminAnalyticsController.prototype, "deleteWebsite", null);
__decorate([
    (0, common_1.Delete)('contact-messages/:id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminAnalyticsController.prototype, "deleteContactMessage", null);
exports.AdminAnalyticsController = AdminAnalyticsController = __decorate([
    (0, common_1.Controller)('admin'),
    (0, common_1.UseGuards)(superadmin_guard_1.SuperadminGuard),
    __metadata("design:paramtypes", [admin_analytics_service_1.AdminAnalyticsService,
        admin_insights_service_1.AdminInsightsService,
        admin_websites_service_1.AdminWebsitesService,
        contact_service_1.ContactService])
], AdminAnalyticsController);
//# sourceMappingURL=admin-analytics.controller.js.map