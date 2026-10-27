import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../email/email.service';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthService {
    private readonly prisma;
    private readonly jwt;
    private readonly email;
    constructor(prisma: PrismaService, jwt: JwtService, email: EmailService);
    checkEmail(emailRaw: string): Promise<{
        available: boolean;
        email: string;
    }>;
    register(dto: RegisterDto): Promise<{
        verificationRequired: boolean;
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            name: string;
            role: import(".prisma/client").$Enums.Role;
        };
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            name: string;
            role: import(".prisma/client").$Enums.Role;
        };
    }>;
    get verificationRequired(): boolean;
    verifyEmail(token: string): Promise<{
        ok: boolean;
    }>;
    resendVerification(emailRaw: string): Promise<{
        ok: boolean;
    }>;
    private get verifySecret();
    private sendVerificationEmail;
    forgotPassword(emailRaw: string): Promise<{
        ok: boolean;
    }>;
    resetPassword(token: string, password: string): Promise<{
        ok: boolean;
    }>;
    private resetSecret;
    private sendWelcomeEmail;
    private touchActivityDay;
    refresh(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            name: string;
            role: import(".prisma/client").$Enums.Role;
        };
    }>;
    logout(userId: string): Promise<{
        ok: boolean;
    }>;
    deleteAccount(userId: string, password: string): Promise<{
        ok: boolean;
    }>;
    me(userId: string): Promise<{
        email: string;
        name: string;
        role: import(".prisma/client").$Enums.Role;
        id: string;
        createdAt: Date;
    }>;
    changePassword(userId: string, currentPassword: string, newPassword: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            name: string;
            role: import(".prisma/client").$Enums.Role;
        };
    }>;
    private resolveRegisterRole;
    private get refreshSecret();
    private issueTokens;
}
