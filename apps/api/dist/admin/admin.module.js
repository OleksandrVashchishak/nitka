"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const contact_module_1 = require("../contact/contact.module");
const admin_analytics_controller_1 = require("./admin-analytics.controller");
const admin_analytics_service_1 = require("./admin-analytics.service");
const admin_auth_controller_1 = require("./admin-auth.controller");
const admin_auth_service_1 = require("./admin-auth.service");
const admin_insights_service_1 = require("./admin-insights.service");
const admin_websites_service_1 = require("./admin-websites.service");
const superadmin_guard_1 = require("./superadmin.guard");
let AdminModule = class AdminModule {
};
exports.AdminModule = AdminModule;
exports.AdminModule = AdminModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET ?? 'dev-jwt-secret-change-me',
            }),
            contact_module_1.ContactModule,
        ],
        controllers: [admin_auth_controller_1.AdminAuthController, admin_analytics_controller_1.AdminAnalyticsController],
        providers: [
            admin_auth_service_1.AdminAuthService,
            admin_analytics_service_1.AdminAnalyticsService,
            admin_insights_service_1.AdminInsightsService,
            admin_websites_service_1.AdminWebsitesService,
            superadmin_guard_1.SuperadminGuard,
        ],
    })
], AdminModule);
//# sourceMappingURL=admin.module.js.map