import { PrismaService } from '../prisma/prisma.service';
export type JwtPayload = {
    sub: string;
    email: string;
    role: string;
};
declare const JwtStrategy_base: new (...args: any) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly prisma;
    constructor(prisma: PrismaService);
    validate(payload: JwtPayload): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        email: string;
        role: import(".prisma/client").$Enums.Role;
    }>;
}
export {};
