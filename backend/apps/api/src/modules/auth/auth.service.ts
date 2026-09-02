import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { RefreshTokenService } from './refresh-token.service';
import { User } from './user.entity';
import { UserRole } from './roles.guard';

type AuthUser = {
  id: string;
  email: string;
  tenantId: string;
  siteId: string;
  roles: UserRole[];
};

const VALID_ROLES: UserRole[] = ['owner', 'admin', 'technician', 'viewer'];

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  private toAuthUser(user: User): AuthUser {
    return {
      id: user.id,
      email: user.email,
      tenantId: user.tenantId,
      siteId: user.siteId,
      roles: this.normalizeRoles(user.roles),
    };
  }

  private normalizeRoles(roles?: string[] | null): UserRole[] {
    const values = Array.isArray(roles) ? roles : [];
    const normalized = values
      .map((role) => String(role).trim().toLowerCase())
      .filter((role): role is UserRole => VALID_ROLES.includes(role as UserRole));

    return normalized.length > 0 ? normalized : ['viewer'];
  }

  private async ensureSiteBelongsToTenant(tenantId: string, siteId: string): Promise<void> {
    const rows = await this.dataSource.query(
      `SELECT tenant_id FROM sites WHERE id = $1 LIMIT 1;`,
      [siteId],
    );

    const siteTenantId = rows?.[0]?.tenant_id;
    if (!siteTenantId) {
      throw new BadRequestException('Site not found');
    }

    if (siteTenantId !== tenantId) {
      throw new BadRequestException('Site does not belong to the provided tenant');
    }
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

  async registerUser(input: {
    tenantId: string;
    siteId: string;
    email: string;
    password: string;
  }) {
    const email = input.email.trim().toLowerCase();

    if (!email || !input.tenantId || !input.siteId || !input.password) {
      throw new BadRequestException('tenantId, siteId, email, and password are required');
    }

    if (input.password.length < 8) {
      throw new BadRequestException('Password must be at least 8 characters long');
    }

    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    await this.ensureSiteBelongsToTenant(input.tenantId, input.siteId);

    const passwordHash = await bcrypt.hash(input.password, 12);

    const user = this.userRepository.create({
      tenantId: input.tenantId,
      siteId: input.siteId,
      email,
      passwordHash,
      roles: ['viewer'],
    });

    const savedUser = await this.userRepository.save(user);
    const authUser = this.toAuthUser(savedUser);

    const [accessToken, refreshToken] = await Promise.all([
      this.issueAccessToken(authUser),
      this.issueRefreshToken(authUser),
    ]);

    return {
      user: {
        id: savedUser.id,
        email: savedUser.email,
        tenantId: savedUser.tenantId,
        siteId: savedUser.siteId,
        roles: savedUser.roles,
      },
      accessToken,
      refreshToken,
      tokenType: 'bearer',
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN', '15m'),
    };
  }

  async createManagedUser(
    input: {
      tenantId: string;
      siteId: string;
      email: string;
      password: string;
      roles: UserRole[];
    },
    callerRoles: UserRole[] = [],
  ) {
    const email = input.email.trim().toLowerCase();

    if (!email || !input.tenantId || !input.siteId || !input.password) {
      throw new BadRequestException('tenantId, siteId, email, and password are required');
    }

    const requestedRoles = this.normalizeRoles(input.roles);
    const currentUserIsOwner = callerRoles.includes('owner');
    const currentUserIsAdmin = callerRoles.includes('admin');

    if (!currentUserIsOwner && currentUserIsAdmin) {
      const forbiddenEscalation = requestedRoles.some(
        (role) => role === 'owner' || role === 'admin',
      );

      if (forbiddenEscalation) {
        throw new ForbiddenException(
          'Admins cannot create owner or admin accounts. Only owners may do that.',
        );
      }
    }

    await this.ensureSiteBelongsToTenant(input.tenantId, input.siteId);

    const passwordHash = await bcrypt.hash(input.password, 12);
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const user = this.userRepository.create({
      tenantId: input.tenantId,
      siteId: input.siteId,
      email,
      passwordHash,
      roles: requestedRoles,
    });

    const savedUser = await this.userRepository.save(user);
    return {
      id: savedUser.id,
      email: savedUser.email,
      tenantId: savedUser.tenantId,
      siteId: savedUser.siteId,
      roles: savedUser.roles,
    };
  }

  async validateUser(email: string, password: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await this.userRepository.findOne({ where: { email: normalizedEmail } });

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return null;
    }

    const authUser = this.toAuthUser(user);
    const [accessToken, refreshToken] = await Promise.all([
      this.issueAccessToken(authUser),
      this.issueRefreshToken(authUser),
    ]);

    return {
      user: {
        id: user.id,
        email: user.email,
        tenantId: user.tenantId,
        siteId: user.siteId,
        roles: this.normalizeRoles(user.roles),
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
