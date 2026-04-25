import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

export abstract class RedisClient extends Redis {}

export const RedisClientProvider = {
  provide: RedisClient,
  useFactory: (configService: ConfigService) => {
    return new Redis(configService.get<string>('REDIS_URL') || '');
  },
  inject: [ConfigService],
};
