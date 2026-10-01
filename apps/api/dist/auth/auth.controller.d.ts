import { AuthService } from './auth.service';
import { AuthUser } from './current-user.decorator';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CheckEmailDto } from './dto/check-email.dto';
import { DeleteAccountDto } from './dto/delete-account.dto';
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
        email: string;
        name: string;
        role: import(".prisma/client").$Enums.Role;
        id: string;
        createdAt: Date;
    }>;
    changePassword(user: AuthUser, dto: ChangePasswordDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            name: string;
            role: import(".prisma/client").$Enums.Role;
        };
    }>;
    deleteAccount(user: AuthUser, dto: DeleteAccountDto): Promise<{
        ok: boolean;
    }>;
}
