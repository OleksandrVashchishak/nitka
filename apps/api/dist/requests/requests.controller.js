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
exports.RequestsController = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const current_user_decorator_1 = require("../auth/current-user.decorator");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const create_request_dto_1 = require("./dto/create-request.dto");
const create_request_message_dto_1 = require("./dto/create-request-message.dto");
const update_request_status_dto_1 = require("./dto/update-request-status.dto");
const requests_service_1 = require("./requests.service");
let RequestsController = class RequestsController {
    constructor(requestsService) {
        this.requestsService = requestsService;
    }
    create(user, dto) {
        return this.requestsService.create(user.id, dto);
    }
    listMine(user) {
        return this.requestsService.listMine(user.id);
    }
    addMessage(user, id, dto) {
        return this.requestsService.addMessage(user.id, user.role, id, dto);
    }
    listForVendor(user) {
        return this.requestsService.listForVendor(user.id);
    }
    updateStatus(user, id, dto) {
        return this.requestsService.updateStatus(user.id, id, dto.status);
    }
    async dashboard(user, res) {
        const data = await this.requestsService.vendorDashboard(user.id);
        if (data === null) {
            res.status(200).type('json').send('null');
            return;
        }
        return data;
    }
};
exports.RequestsController = RequestsController;
__decorate([
    (0, common_1.Post)('requests'),
    (0, roles_guard_1.Roles)(client_1.Role.COUPLE, client_1.Role.ADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_request_dto_1.CreateRequestDto]),
    __metadata("design:returntype", void 0)
], RequestsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('requests'),
    (0, roles_guard_1.Roles)(client_1.Role.COUPLE, client_1.Role.ADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RequestsController.prototype, "listMine", null);
__decorate([
    (0, common_1.Post)('requests/:id/messages'),
    (0, roles_guard_1.Roles)(client_1.Role.COUPLE, client_1.Role.VENDOR, client_1.Role.ADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, create_request_message_dto_1.CreateRequestMessageDto]),
    __metadata("design:returntype", void 0)
], RequestsController.prototype, "addMessage", null);
__decorate([
    (0, common_1.Get)('vendor/requests'),
    (0, roles_guard_1.Roles)(client_1.Role.VENDOR, client_1.Role.ADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RequestsController.prototype, "listForVendor", null);
__decorate([
    (0, common_1.Patch)('vendor/requests/:id'),
    (0, roles_guard_1.Roles)(client_1.Role.VENDOR, client_1.Role.ADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_request_status_dto_1.UpdateRequestStatusDto]),
    __metadata("design:returntype", void 0)
], RequestsController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Get)('vendor/dashboard'),
    (0, roles_guard_1.Roles)(client_1.Role.VENDOR, client_1.Role.ADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "dashboard", null);
exports.RequestsController = RequestsController = __decorate([
    (0, common_1.Controller)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [requests_service_1.RequestsService])
], RequestsController);
//# sourceMappingURL=requests.controller.js.map