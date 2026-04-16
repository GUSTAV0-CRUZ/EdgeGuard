import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TicketModule } from './ticket/ticket.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), TicketModule],
  controllers: [],
})
export class AppModule {}
