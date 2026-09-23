"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./auth/auth.module");
const roles_guard_1 = require("./auth/roles.guard");
const prisma_module_1 = require("./prisma/prisma.module");
const weddings_module_1 = require("./weddings/weddings.module");
const favorites_module_1 = require("./favorites/favorites.module");
const guests_module_1 = require("./guests/guests.module");
const budget_module_1 = require("./budget/budget.module");
const notifications_module_1 = require("./notifications/notifications.module");
const uploads_module_1 = require("./uploads/uploads.module");
const content_module_1 = require("./content/content.module");
const website_module_1 = require("./website/website.module");
const invitations_module_1 = require("./invitations/invitations.module");
const email_module_1 = require("./email/email.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            email_module_1.EmailModule,
            auth_module_1.AuthModule,
            weddings_module_1.WeddingsModule,
            favorites_module_1.FavoritesModule,
            guests_module_1.GuestsModule,
            budget_module_1.BudgetModule,
            notifications_module_1.NotificationsModule,
            uploads_module_1.UploadsModule,
            content_module_1.ContentModule,
            website_module_1.WebsiteModule,
            invitations_module_1.InvitationsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, roles_guard_1.RolesGuard],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map