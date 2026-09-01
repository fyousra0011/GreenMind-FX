import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { RefreshTokenService } from './refresh-token.service';
import { UserRole } from './roles.guard';

type AuthUser = {
  id: string;
  email: string;
  tenantId: string;
  siteId: string;
  roles: UserRole[];
};

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  private async issueAccessToken(user: AuthUser) {
    return this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      tenantId: user.tenantId,
      siteId: user.siteId,
      roles: user.roles,
      type: 'access',
    });
  }

  private async issueRefreshToken(user: AuthUser) {
    const refreshToken = await this.jwtService.signAsync(
      {
        sub: user.id,
        email: user.email,
        tenantId: user.tenantId,
        siteId: user.siteId,
        roles: user.roles,
        type: 'refresh',
      },
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET', 'refresh-secret'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d'),
      },
    );

    const tokenHash = this.hashToken(refreshToken);
    await this.refreshTokenService.storeHash(user.id, tokenHash);

    return refreshToken;
  }

  async validateUser(email: string, password: string) {
    const users: Record<string, AuthUser> = {
      'owner@greenmind.local': {
        id: 'user-owner',
        email,
        tenantId: 'tenant-1',
        siteId: 'site-1',
        roles: ['owner'],
      },
      'admin@greenmind.local': {
        id: 'user-admin',
        email,
        tenantId: 'tenant-1',
        siteId: 'site-1',
        roles: ['admin'],
      },
      'tech@greenmind.local': {
        id: 'user-tech',
        email,
        tenantId: 'tenant-1',
        siteId: 'site-1',
        roles: ['technician'],
      },
      'viewer@greenmind.local': {
        id: 'user-viewer',
        email,
        tenantId: 'tenant-1',
        siteId: 'site-1',
        roles: ['viewer'],
      },
    };

    const user = users[email];

    if (!user || password !== 'ChangeMe123!') {
      return null;
    }

    const [accessToken, refreshToken] = await Promise.all([
      this.issueAccessToken(user),
      this.issueRefreshToken(user),
    ]);

    return {
      user: {
        id: user.id,
        email: user.email,
        tenantId: user.tenantId,
        siteId: user.siteId,
        roles: user.roles,
      },
      accessToken,
      refreshToken,
      tokenType: 'bearer',
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN', '15m'),
    };
  }

  async refreshTokens(refreshToken: string) {
    let decoded: { sub: string; email: string; tenantId: string; siteId: string; roles: UserRole[]; type?: string };

    try {
      decoded = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET', 'refresh-secret'),
      });
    } catch {
      throw new UnauthorizedException('Refresh token is invalid or expired');
    }

    if (decoded.type !== 'refresh') {
      throw new UnauthorizedException('Token type is not a refresh token');
    }

    const currentHash = this.hashToken(refreshToken);
    const latestHash = await this.refreshTokenService.findLatestHashForUser(decoded.sub);

    if (!latestHash || latestHash !== currentHash) {
      throw new UnauthorizedException('Refresh token has been revoked or rotated');
    }

    const user: AuthUser = {
      id: decoded.sub,
      email: decoded.email,
      tenantId: decoded.tenantId,
      siteId: decoded.siteId,
      roles: decoded.roles,
    };

    const nextRefreshToken = await this.issueRefreshToken(user);
    const nextAccessToken = await this.issueAccessToken(user);

    await this.refreshTokenService.rotate(decoded.sub, currentHash, this.hashToken(nextRefreshToken));

    return {
      accessToken: nextAccessToken,
      refreshToken: nextRefreshToken,
      tokenType: 'bearer',
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN', '15m'),
    };
  }

  async getCurrentScope(request: { tenantId?: string; siteId?: string }) {
    return {
      tenantId: request.tenantId ?? 'tenant-1',
      siteId: request.siteId ?? 'site-1',
    };
  }
}
