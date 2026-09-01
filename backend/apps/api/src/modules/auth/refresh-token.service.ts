import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshToken } from './refresh-token.entity';

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  async storeHash(userId: string, tokenHash: string): Promise<RefreshToken> {
    const refreshToken = this.refreshTokenRepository.create({
      userId,
      tokenHash,
      revokedAt: null,
    });

    return this.refreshTokenRepository.save(refreshToken);
  }

  async findLatestHashForUser(userId: string): Promise<string | null> {
    const latest = await this.refreshTokenRepository.findOne({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    return latest?.tokenHash ?? null;
  }

  async rotate(userId: string, currentHash: string, nextHash: string): Promise<void> {
    const currentRefreshToken = await this.refreshTokenRepository.findOne({
      where: { userId, tokenHash: currentHash },
      order: { createdAt: 'DESC' },
    });

    if (!currentRefreshToken) {
      throw new NotFoundException('Refresh token not found for this user');
    }

    currentRefreshToken.revokedAt = new Date();
    await this.refreshTokenRepository.save(currentRefreshToken);

    const replacementToken = this.refreshTokenRepository.create({
      userId,
      tokenHash: nextHash,
      revokedAt: null,
    });

    await this.refreshTokenRepository.save(replacementToken);
  }
}
