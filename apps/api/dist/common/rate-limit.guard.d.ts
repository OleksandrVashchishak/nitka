import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
export type RateLimitRule = {
    limit: number;
    windowSeconds: number;
    by: 'ip' | 'email';
};
export declare const RateLimit: (...rules: RateLimitRule[]) => import("@nestjs/common").CustomDecorator<string>;
export declare class RateLimitGuard implements CanActivate {
    private readonly reflector;
    private readonly hits;
    constructor(reflector: Reflector);
    canActivate(context: ExecutionContext): boolean;
    private prune;
}
