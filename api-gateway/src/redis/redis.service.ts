import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import type { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);

  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  private loggerError(error: any, methodName: string) {
    if (!(error instanceof Error)) {
      this.logger.error('incomon error');
      return;
    }

    this.logger.error(
      JSON.stringify({
        message: error.message,
        method: methodName,
        stackTrace: error.stack,
      }),
    );
  }

  async getCache<T>(key: string): Promise<T | undefined> {
    try {
      return await this.cacheManager.get<T>(key);
    } catch (error: any) {
      this.loggerError(error, this.getCache.name);
      return undefined;
    }
  }

  async setCache<T>(key: string, data: T, ttlInSeconds: number): Promise<void> {
    const ttl = ttlInSeconds * 1000;

    try {
      await this.cacheManager.set(key, data, ttl);
    } catch (error: any) {
      this.loggerError(error, this.setCache.name);
    }
  }
}
