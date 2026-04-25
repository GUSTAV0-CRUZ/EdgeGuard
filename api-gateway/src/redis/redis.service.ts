import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import type { Cache } from 'cache-manager';
import { RedisClient } from './providers/redis-client.provider';

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);

  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly redisClient: RedisClient,
  ) {}

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

  async delKeyCache(key: string): Promise<void> {
    try {
      await this.cacheManager.del(key);
    } catch (error: any) {
      this.loggerError(error, this.setCache.name);
    }
  }

  async rateLimit(
    elemetKey: string,
    limitReq: number = 6,
    ttl: number = 60,
  ): Promise<boolean> {
    const key = `rateLimite:${elemetKey}`;

    const currentRequests = await this.redisClient.incr(key);

    if (currentRequests === 1) await this.redisClient.expire(key, ttl);

    if (currentRequests > limitReq)
      throw new HttpException('too many requests', 429);

    return true;
  }

  async acquireLock(id: string, ttl: number = 5): Promise<boolean> {
    const key = `lock:ticket:${id}`;

    const acquireLock = await this.redisClient.set(
      key,
      'locked',
      'EX',
      ttl,
      'NX',
    );

    if (!acquireLock)
      throw new HttpException('conflict in required resource', 409);

    return true;
  }

  async releaseLock(id: string): Promise<void> {
    const key = `lock:ticket:${id}`;
    await this.redisClient.del(key);
  }
}
