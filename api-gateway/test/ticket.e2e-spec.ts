import { Test, TestingModule } from '@nestjs/testing';
import {
  Global,
  INestApplication,
  Module,
  ValidationPipe,
} from '@nestjs/common';
import { App } from 'supertest/types';
import { ConfigModule } from '@nestjs/config';
import { ClientProxyRmqModule } from '../src/client-proxy-rmq/client-proxy-rmq.module';
import { TicketModule } from '../src/ticket/ticket.module';
import { AllExceptionFilter } from '../src/common/filters/all-exception.filter';
import { RedisClient } from '../src/redis/providers/redis-client.provider';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { RedisService } from '../src/redis/redis.service';

@Global()
@Module({
  providers: [
    RedisService,
    {
      provide: RedisClient,
      useValue: {
        incr: jest.fn().mockResolvedValue(1),
        expire: jest.fn().mockResolvedValue(true),
        set: jest.fn().mockResolvedValue('OK'),
        get: jest.fn().mockResolvedValue(null),
        del: jest.fn().mockResolvedValue(1),
      },
    },
    {
      provide: CACHE_MANAGER,
      useValue: {
        get: jest.fn(),
        set: jest.fn(),
        del: jest.fn(),
      },
    },
  ],
  exports: [RedisService, RedisClient, CACHE_MANAGER],
})
class FakeRedisModule {}

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        ClientProxyRmqModule,
        TicketModule,
        FakeRedisModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new AllExceptionFilter());

    await app.init();
  });

  it('', () => {});
});
