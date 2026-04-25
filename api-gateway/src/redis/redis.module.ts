import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { ConfigService } from '@nestjs/config';
import {
  RedisClient,
  RedisClientProvider,
} from './providers/redis-client.provider';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async (
        configService: ConfigService,
        redisClient: RedisClient,
      ) => ({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        store: await redisStore({
          redis: redisClient,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          ttl: configService.get('REDIS_TTL'),
        } as any),
      }),
      inject: [ConfigService, RedisClient],
    }),
  ],
  providers: [RedisService, RedisClientProvider],
  exports: [RedisService, RedisClient],
})
export class RedisModule {}
