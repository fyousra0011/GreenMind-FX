import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRole } from './roles.guard';

export type JwtPayload = {
  sub: string;
  email: string;
  tenantId: string;
  siteId: string;
  roles: UserRole[];
  type?: 'access' | 'refresh';
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET', 'dev-secret'),
    });
  }

  async validate(payload: JwtPayload) {
    return {
      id: payload.sub,
      email: payload.email,
      tenantId: payload.tenantId,
      siteId: payload.siteId,
      roles: payload.roles ?? [],
    };
  }
}
