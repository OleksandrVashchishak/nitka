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
const categories_module_1 = require("./categories/categories.module");
const vendors_module_1 = require("./vendors/vendors.module");
const weddings_module_1 = require("./weddings/weddings.module");
const favorites_module_1 = require("./favorites/favorites.module");
const requests_module_1 = require("./requests/requests.module");
const admin_module_1 = require("./admin/admin.module");
const guests_module_1 = require("./guests/guests.module");
const budget_module_1 = require("./budget/budget.module");
const reviews_module_1 = require("./reviews/reviews.module");
const notifications_module_1 = require("./notifications/notifications.module");
const uploads_module_1 = require("./uploads/uploads.module");
const content_module_1 = require("./content/content.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            categories_module_1.CategoriesModule,
            vendors_module_1.VendorsModule,
            weddings_module_1.WeddingsModule,
            favorites_module_1.FavoritesModule,
            requests_module_1.RequestsModule,
            admin_module_1.AdminModule,
            guests_module_1.GuestsModule,
            budget_module_1.BudgetModule,
            reviews_module_1.ReviewsModule,
            notifications_module_1.NotificationsModule,
            uploads_module_1.UploadsModule,
            content_module_1.ContentModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, roles_guard_1.RolesGuard],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map