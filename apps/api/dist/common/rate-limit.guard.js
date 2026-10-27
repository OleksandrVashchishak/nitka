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
exports.RateLimitGuard = exports.RateLimit = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const RATE_LIMIT_KEY = 'rate-limit';
const RateLimit = (...rules) => (0, common_1.SetMetadata)(RATE_LIMIT_KEY, rules);
exports.RateLimit = RateLimit;
let RateLimitGuard = class RateLimitGuard {
    constructor(reflector) {
        this.reflector = reflector;
        this.hits = new Map();
        setInterval(() => this.prune(), 5 * 60 * 1000).unref();
    }
    canActivate(context) {
        const rules = this.reflector.get(RATE_LIMIT_KEY, context.getHandler());
        if (!rules?.length)
            return true;
        const req = context.switchToHttp().getRequest();
        const route = `${req.method}:${req.route?.path ?? req.path}`;
        const now = Date.now();
        const keys = [];
        for (const rule of rules) {
            const subject = rule.by === 'email'
                ? String(req.body?.email ?? '')
                    .trim()
                    .toLowerCase()
                : (req.ip ?? '');
            if (!subject)
                continue;
            const key = `${route}|${rule.by}|${subject}`;
            const recent = (this.hits.get(key) ?? []).filter((t) => now - t < rule.windowSeconds * 1000);
            this.hits.set(key, recent);
            if (recent.length >= rule.limit) {
                const retryMin = Math.ceil((rule.windowSeconds * 1000 - (now - recent[0])) / 60000);
                throw new common_1.HttpException(`Забагато спроб. Спробуй за ${retryMin} хв`, common_1.HttpStatus.TOO_MANY_REQUESTS);
            }
            keys.push({ key, rule });
        }
        for (const { key } of keys)
            this.hits.get(key).push(now);
        return true;
    }
    prune() {
        const now = Date.now();
        for (const [key, times] of this.hits) {
            if (!times.length || now - times[times.length - 1] > 60 * 60 * 1000) {
                this.hits.delete(key);
            }
        }
    }
};
exports.RateLimitGuard = RateLimitGuard;
exports.RateLimitGuard = RateLimitGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], RateLimitGuard);
//# sourceMappingURL=rate-limit.guard.js.map