import { Module } from '@nestjs/common';
import { ClientProxyRmqService } from './client-proxy-rmq.service';

@Module({
  providers: [ClientProxyRmqService],
})
export class ClientProxyRmqModule {}
