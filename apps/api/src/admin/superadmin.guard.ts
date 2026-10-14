import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SUPERADMIN_ROLE, SUPERADMIN_SUB } from './admin.constants';

export type SuperadminPayload = {
  sub: string;
  email: string;
  role: string;
};

@Injectable()
export class SuperadminGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<{
      headers: { authorization?: string };
      superadmin?: SuperadminPayload;
    }>();

    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      throw new UnauthorizedException();
    }

    const token = header.slice('Bearer '.length).trim();
    if (!token) {
      throw new UnauthorizedException();
    }

    let payload: SuperadminPayload;
    try {
      payload = await this.jwt.verifyAsync<SuperadminPayload>(token, {
        secret: process.env.JWT_SECRET ?? 'dev-jwt-secret-change-me',
      });
    } catch {
      throw new UnauthorizedException();
    }

    if (
      payload.sub !== SUPERADMIN_SUB ||
      payload.role !== SUPERADMIN_ROLE ||
      !payload.email
    ) {
      throw new UnauthorizedException();
    }

    req.superadmin = payload;
    return true;
  }
}
