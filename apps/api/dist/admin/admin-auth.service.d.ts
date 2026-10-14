import { JwtService } from '@nestjs/jwt';
import { AdminLoginDto } from './dto/admin-login.dto';
export declare class AdminAuthService {
    private readonly jwt;
    constructor(jwt: JwtService);
    login(dto: AdminLoginDto): Promise<{
        accessToken: string;
        user: {
            email: string;
            role: string;
        };
    }>;
}
