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
exports.UpsertWeddingDto = void 0;
const openapi = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class UpsertWeddingDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { date: { required: true, type: () => String }, city: { required: true, type: () => String }, guests: { required: true, type: () => Number, minimum: 1 }, budget: { required: true, type: () => Number, minimum: 0 }, partnerOneName: { required: false, type: () => String, maxLength: 80 }, partnerTwoName: { required: false, type: () => String, maxLength: 80 }, couplePhotoUrl: { required: false, type: () => String, nullable: true, maxLength: 2000 }, planningStage: { required: false, type: () => String, enum: [
                    'NOT_ENGAGED',
                    'EXPLORING',
                    'PLANNING_NO_VENUE',
                    'PLANNING_WITH_VENUE',
                    'FINAL_DETAILS',
                ] }, cityUndecided: { required: false, type: () => Boolean }, guestsUndecided: { required: false, type: () => Boolean } };
    }
}
exports.UpsertWeddingDto = UpsertWeddingDto;
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpsertWeddingDto.prototype, "date", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpsertWeddingDto.prototype, "city", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], UpsertWeddingDto.prototype, "guests", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpsertWeddingDto.prototype, "budget", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(80),
    __metadata("design:type", String)
], UpsertWeddingDto.prototype, "partnerOneName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(80),
    __metadata("design:type", String)
], UpsertWeddingDto.prototype, "partnerTwoName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(2000),
    __metadata("design:type", Object)
], UpsertWeddingDto.prototype, "couplePhotoUrl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)([
        'NOT_ENGAGED',
        'EXPLORING',
        'PLANNING_NO_VENUE',
        'PLANNING_WITH_VENUE',
        'FINAL_DETAILS',
    ]),
    __metadata("design:type", String)
], UpsertWeddingDto.prototype, "planningStage", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpsertWeddingDto.prototype, "cityUndecided", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpsertWeddingDto.prototype, "guestsUndecided", void 0);
//# sourceMappingURL=upsert-wedding.dto.js.map