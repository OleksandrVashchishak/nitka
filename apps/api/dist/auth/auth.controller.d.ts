import { AuthService } from './auth.service';
import { AuthUser } from './current-user.decorator';
import { CheckEmailDto } from './dto/check-email.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    checkEmail(query: CheckEmailDto): Promise<{
        available: boolean;
        email: string;
    }>;
    register(dto: RegisterDto): Promise<{
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
    refresh(dto: RefreshDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            name: string;
            role: import(".prisma/client").$Enums.Role;
        };
    }>;
    logout(user: AuthUser): Promise<{
        ok: boolean;
    }>;
    me(user: AuthUser): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        email: string;
        role: import(".prisma/client").$Enums.Role;
    }>;
}
