import { Module } from '@nestjs/common';
import { TicketController } from './ticket.controller';
import { ClientProxyRmqModule } from '../client-proxy-rmq/client-proxy-rmq.module';

@Module({
  imports: [ClientProxyRmqModule],
  controllers: [TicketController],
})
export class TicketModule {}
