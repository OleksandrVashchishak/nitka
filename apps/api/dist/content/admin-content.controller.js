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
exports.AdminContentController = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const current_user_decorator_1 = require("../auth/current-user.decorator");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const content_service_1 = require("./content.service");
const content_dto_1 = require("./dto/content.dto");
let AdminContentController = class AdminContentController {
    constructor(contentService) {
        this.contentService = contentService;
    }
    listTopics() {
        return this.contentService.listTopics();
    }
    createTopic(dto) {
        return this.contentService.createTopic(dto);
    }
    updateTopic(id, dto) {
        return this.contentService.updateTopic(id, dto);
    }
    deleteTopic(id) {
        return this.contentService.deleteTopic(id);
    }
    listPosts(status, topic, q) {
        return this.contentService.adminListPosts({ status, topic, q });
    }
    getPost(id) {
        return this.contentService.adminGetPost(id);
    }
    createPost(user, dto) {
        return this.contentService.createPost(user.id, dto);
    }
    updatePost(id, dto) {
        return this.contentService.updatePost(id, dto);
    }
    updateStatus(id, dto) {
        return this.contentService.updateStatus(id, dto.status);
    }
    deletePost(id) {
        return this.contentService.deletePost(id);
    }
};
exports.AdminContentController = AdminContentController;
__decorate([
    (0, common_1.Get)('topics'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminContentController.prototype, "listTopics", null);
__decorate([
    (0, common_1.Post)('topics'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [content_dto_1.UpsertContentTopicDto]),
    __metadata("design:returntype", void 0)
], AdminContentController.prototype, "createTopic", null);
__decorate([
    (0, common_1.Put)('topics/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, content_dto_1.UpsertContentTopicDto]),
    __metadata("design:returntype", void 0)
], AdminContentController.prototype, "updateTopic", null);
__decorate([
    (0, common_1.Delete)('topics/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminContentController.prototype, "deleteTopic", null);
__decorate([
    (0, common_1.Get)('posts'),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Query)('topic')),
    __param(2, (0, common_1.Query)('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], AdminContentController.prototype, "listPosts", null);
__decorate([
    (0, common_1.Get)('posts/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminContentController.prototype, "getPost", null);
__decorate([
    (0, common_1.Post)('posts'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, content_dto_1.UpsertContentPostDto]),
    __metadata("design:returntype", void 0)
], AdminContentController.prototype, "createPost", null);
__decorate([
    (0, common_1.Put)('posts/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, content_dto_1.UpsertContentPostDto]),
    __metadata("design:returntype", void 0)
], AdminContentController.prototype, "updatePost", null);
__decorate([
    (0, common_1.Patch)('posts/:id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, content_dto_1.UpdateContentStatusDto]),
    __metadata("design:returntype", void 0)
], AdminContentController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Delete)('posts/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminContentController.prototype, "deletePost", null);
exports.AdminContentController = AdminContentController = __decorate([
    (0, common_1.Controller)('admin/content'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(client_1.Role.ADMIN),
    __metadata("design:paramtypes", [content_service_1.ContentService])
], AdminContentController);
//# sourceMappingURL=admin-content.controller.js.map