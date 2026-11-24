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
exports.CreateSmartPlanTasksDto = exports.SmartPlanTaskItemDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class SmartPlanTaskItemDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { templateId: { required: true, type: () => String, minLength: 1, maxLength: 80 }, title: { required: true, type: () => String, minLength: 2 }, categorySlug: { required: false, type: () => String }, dueDate: { required: false, type: () => String }, isUrgent: { required: false, type: () => Boolean } };
    }
}
exports.SmartPlanTaskItemDto = SmartPlanTaskItemDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    (0, class_validator_1.MaxLength)(80),
    __metadata("design:type", String)
], SmartPlanTaskItemDto.prototype, "templateId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    __metadata("design:type", String)
], SmartPlanTaskItemDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SmartPlanTaskItemDto.prototype, "categorySlug", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], SmartPlanTaskItemDto.prototype, "dueDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], SmartPlanTaskItemDto.prototype, "isUrgent", void 0);
class CreateSmartPlanTasksDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { tasks: { required: true, type: () => [require("./create-smart-plan-tasks.dto").SmartPlanTaskItemDto], maxItems: 200 } };
    }
}
exports.CreateSmartPlanTasksDto = CreateSmartPlanTasksDto;
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMaxSize)(200),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => SmartPlanTaskItemDto),
    __metadata("design:type", Array)
], CreateSmartPlanTasksDto.prototype, "tasks", void 0);
//# sourceMappingURL=create-smart-plan-tasks.dto.js.map