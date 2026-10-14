import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
export type SuperadminPayload = {
    sub: string;
    email: string;
    role: string;
};
export declare class SuperadminGuard implements CanActivate {
    private readonly jwt;
    constructor(jwt: JwtService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
