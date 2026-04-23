import { Module } from '@nestjs/common';
import { ClientProxyRmqModule } from './client-proxy-rmq/client-proxy-rmq.module';
import { ConfigModule } from '@nestjs/config';
import { TicketModule } from './ticket/ticket.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ClientProxyRmqModule,
    TicketModule,
    RedisModule,
  ],
})
export class AppModule {}
