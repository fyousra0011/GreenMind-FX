import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';

@Controller('auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
