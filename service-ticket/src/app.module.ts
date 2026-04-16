import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TicketModule } from './ticket/ticket.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(String(process.env.MONGODB_URL)),
    TicketModule,
  ],
  controllers: [],
})
export class AppModule {}
