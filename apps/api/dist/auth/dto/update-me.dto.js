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
exports.UpdateMeDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class UpdateMeDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { gender: { required: false, type: () => Object, description: "\u0414\u043B\u044F \u0443\u0437\u0433\u043E\u0434\u0436\u0435\u043D\u043D\u044F \u0434\u0456\u0454\u0441\u043B\u0456\u0432 \u0443 \u0441\u043F\u043E\u0432\u0456\u0449\u0435\u043D\u043D\u044F\u0445 \u043F\u0430\u0440\u0442\u043D\u0435\u0440\u0443: \u00AB\u0434\u043E\u0434\u0430\u0432\u00BB / \u00AB\u0434\u043E\u0434\u0430\u043B\u0430\u00BB.", enum: ['female', 'male', null] } };
    }
}
exports.UpdateMeDto = UpdateMeDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['female', 'male', null]),
    __metadata("design:type", Object)
], UpdateMeDto.prototype, "gender", void 0);
//# sourceMappingURL=update-me.dto.js.map