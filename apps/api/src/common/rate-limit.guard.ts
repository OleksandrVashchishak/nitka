import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';

export type RateLimitRule = {
  /** Максимум запитів у вікні. */
  limit: number;
  windowSeconds: number;
  /** Ключ ліміту: IP клієнта або email із тіла запиту. */
  by: 'ip' | 'email';
};

const RATE_LIMIT_KEY = 'rate-limit';

export const RateLimit = (...rules: RateLimitRule[]) =>
  SetMetadata(RATE_LIMIT_KEY, rules);

/** In-memory ліміт: достатньо для одного інстансу API (Render), не переживає рестарт. */
@Injectable()
export class RateLimitGuard implements CanActivate {
  private readonly hits = new Map<string, number[]>();

  constructor(private readonly reflector: Reflector) {
    setInterval(() => this.prune(), 5 * 60 * 1000).unref();
  }

  canActivate(context: ExecutionContext) {
    const rules = this.reflector.get<RateLimitRule[] | undefined>(
      RATE_LIMIT_KEY,
      context.getHandler(),
    );
    if (!rules?.length) return true;

    const req = context.switchToHttp().getRequest<Request>();
    const route = `${req.method}:${req.route?.path ?? req.path}`;
    const now = Date.now();

    // Спочатку перевіряємо всі правила, щоб відхилений запит не з'їдав ліміт інших.
    const keys: { key: string; rule: RateLimitRule }[] = [];
    for (const rule of rules) {
      const subject =
        rule.by === 'email'
          ? String((req.body as { email?: unknown } | undefined)?.email ?? '')
              .trim()
              .toLowerCase()
          : (req.ip ?? '');
      if (!subject) continue;
      const key = `${route}|${rule.by}|${subject}`;
      const recent = (this.hits.get(key) ?? []).filter(
        (t) => now - t < rule.windowSeconds * 1000,
      );
      this.hits.set(key, recent);
      if (recent.length >= rule.limit) {
        const retryMin = Math.ceil(
          (rule.windowSeconds * 1000 - (now - recent[0])) / 60000,
        );
        throw new HttpException(
          `Забагато спроб. Спробуй за ${retryMin} хв`,
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
      keys.push({ key, rule });
    }
    for (const { key } of keys) this.hits.get(key)!.push(now);
    return true;
  }

  private prune() {
    const now = Date.now();
    for (const [key, times] of this.hits) {
      if (!times.length || now - times[times.length - 1] > 60 * 60 * 1000) {
        this.hits.delete(key);
      }
    }
  }
}
