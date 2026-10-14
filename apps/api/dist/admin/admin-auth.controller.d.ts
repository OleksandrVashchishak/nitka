import { AdminAuthService } from './admin-auth.service';
import { AdminLoginDto } from './dto/admin-login.dto';
export declare class AdminAuthController {
    private readonly adminAuth;
    constructor(adminAuth: AdminAuthService);
    login(dto: AdminLoginDto): Promise<{
        accessToken: string;
        user: {
            email: string;
            role: string;
        };
    }>;
}
