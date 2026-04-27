/* eslint-disable @typescript-eslint/unbound-method */
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
import request from 'supertest';
import { of } from 'rxjs';
import { ClientProxyRmqService } from '../src/client-proxy-rmq/client-proxy-rmq.service';

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

const mockProxy = {
  send: jest.fn().mockReturnValue(of([])),
  emit: jest.fn().mockReturnValue(of({})),
};

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
    })
      .overrideProvider(ClientProxyRmqService)
      .useValue({
        getServiceTicketclientProxy: () => mockProxy,
      })
      .compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new AllExceptionFilter());

    await app.init();
  });

  describe('GET /ticket', () => {
    it('should fetch from microservice and save in cache', async () => {
      const mockTickets = [{ id: '1', number: 1 }];
      const redisService = app.get(RedisService);
      const clientProxyService = app.get(ClientProxyRmqService);
      const proxy = clientProxyService.getServiceTicketclientProxy();

      jest.spyOn(redisService, 'getCache').mockResolvedValue(null);
      jest.spyOn(proxy, 'send').mockReturnValue(of(mockTickets));
      const setCacheSpy = jest.spyOn(redisService, 'setCache');

      const response = await request(app.getHttpServer()).get('/ticket');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockTickets);
      expect(proxy.send).toHaveBeenCalledWith('findAll-ticket', '');
      expect(setCacheSpy).toHaveBeenCalledWith('ticket:all', mockTickets, 30);
    });

    it('should return data from cache if exists and not call any microsservice', async () => {
      const cachedData = [{ id: 'cache-1', number: 1 }];
      const redisService = app.get(RedisService);
      const clientProxyService = app.get(ClientProxyRmqService);
      const proxy = clientProxyService.getServiceTicketclientProxy();

      jest.clearAllMocks();
      jest.spyOn(redisService, 'getCache').mockResolvedValue(cachedData);
      const proxySpy = jest.spyOn(proxy, 'send');

      const response = await request(app.getHttpServer()).get('/ticket');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(cachedData);
      expect(proxySpy).not.toHaveBeenCalled();
    });
  });
});
