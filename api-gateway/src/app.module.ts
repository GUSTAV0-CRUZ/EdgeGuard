import { Module } from '@nestjs/common';
import { ClientProxyRmqModule } from './client-proxy-rmq/client-proxy-rmq.module';

@Module({
  imports: [ClientProxyRmqModule]
})
export class AppModule {}
