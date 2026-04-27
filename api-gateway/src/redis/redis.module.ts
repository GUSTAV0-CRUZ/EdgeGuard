import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { CacheModule } from '@nestjs/cache-manager';
import {
  RedisClient,
  RedisClientProvider,
} from './providers/redis-client.provider';
import KeyvRedis, { Keyv } from '@keyv/redis';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      // eslint-disable-next-line @typescript-eslint/require-await
      useFactory: async (redisClient: RedisClient) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const keyvRedis = new KeyvRedis(redisClient as any);

        return {
          store: new Keyv({ store: keyvRedis }),
        };
      },
      inject: [RedisClient],
    }),
  ],
  providers: [RedisService, RedisClientProvider],
  exports: [RedisService, RedisClient],
})
export class RedisModule {}
