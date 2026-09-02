import {
  Body,
  Controller,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { LoginDto } from './dto/login.dto';
import { RegisterUserDto } from './dto/register.dto';
import { CreateManagedUserDto } from './dto/create-managed-user.dto';
import { AuthService } from './auth.service';
import { Roles, RolesGuard, UserRole } from './roles.guard';

@Controller('auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Throttle({
    default: { ttl: 60_000, limit: 60 },
    login: { ttl: 60_000, limit: 5 },
  })
  async register(@Body() dto: RegisterUserDto) {
    return this.authService.registerUser({
      tenantId: dto.tenantId,
      siteId: dto.siteId,
      email: dto.email,
      password: dto.password,
    });
  }

  @Post('users')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('owner', 'admin')
  @Throttle({
    default: { ttl: 60_000, limit: 60 },
    login: { ttl: 60_000, limit: 5 },
  })
  async createManagedUser(
    @Body() dto: CreateManagedUserDto,
    @Req() req: { user?: { roles?: UserRole[] } },
  ) {
    return this.authService.createManagedUser(
      {
        tenantId: dto.tenantId,
        siteId: dto.siteId,
        email: dto.email,
        password: dto.password,
        roles: dto.roles,
      },
      req.user?.roles ?? [],
    );
  }

  @Post('login')
  @Throttle({
    default: { ttl: 60_000, limit: 60 },
    login: { ttl: 60_000, limit: 5 },
  })
  async login(@Body() dto: LoginDto) {
    const result = await this.authService.validateUser(dto.email, dto.password);

    if (!result) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return result;
  }
}
