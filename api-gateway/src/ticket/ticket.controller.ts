import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateTicketDto } from './dtos/create-ticket.dto';
import { ClientProxyRmqService } from '../client-proxy-rmq/client-proxy-rmq.service';
import { ClientProxy } from '@nestjs/microservices';
import { ApiResponse } from '@nestjs/swagger';
import { ResponseTicketDto } from './dtos/response-ticket.dto';
import { RedisService } from '../redis/redis.service';
import { lastValueFrom } from 'rxjs';
import { RateLimitGuard } from '../common/guards/rate-limit.guard';
import { LockInterceptor } from '../common/interceptors/lock.interceptor';

@Controller('ticket')
export class TicketController {
  private readonly serviceTicketclientProxy: ClientProxy;

  constructor(
    ticketService: ClientProxyRmqService,
    private redisService: RedisService,
  ) {
    this.serviceTicketclientProxy = ticketService.getServiceTicketclientProxy();
  }

  @HttpCode(202)
  @Post()
  async create(@Body() createTicketDto: CreateTicketDto) {
    this.serviceTicketclientProxy.emit('create-ticket', createTicketDto);
    await this.redisService.delKeyCache('ticket:all');
    return;
  }

  @ApiResponse({
    status: 200,
    type: [ResponseTicketDto],
  })
  @Get()
  async findAll(): Promise<ResponseTicketDto[]> {
    const cache =
      await this.redisService.getCache<ResponseTicketDto[]>('ticket:all');

    if (cache) return cache;

    const tickets = await lastValueFrom<ResponseTicketDto[]>(
      this.serviceTicketclientProxy.send('findAll-ticket', ''),
    );

    await this.redisService.setCache<ResponseTicketDto[]>(
      'ticket:all',
      tickets,
      30,
    );

    return tickets;
  }

  @ApiResponse({
    status: 200,
    type: ResponseTicketDto,
  })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ResponseTicketDto> {
    const cache = await this.redisService.getCache<ResponseTicketDto>(
      `ticket:${id}`,
    );

    if (cache) return cache;

    const tickets = await lastValueFrom<ResponseTicketDto>(
      this.serviceTicketclientProxy.send('findOne-ticket', id),
    );

    await this.redisService.setCache<ResponseTicketDto>(
      `ticket:${id}`,
      tickets,
      5,
    );

    return tickets;
  }

  @HttpCode(202)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    this.serviceTicketclientProxy.emit('delete-ticket', id);
    await this.redisService.delKeyCache(`ticket:${id}`);
    await this.redisService.delKeyCache('ticket:all');
    return;
  }

  @UseGuards(RateLimitGuard)
  @UseInterceptors(LockInterceptor)
  @HttpCode(202)
  @Patch(':id/reserve-ticket')
  async reserve(@Param('id') id: string) {
    this.serviceTicketclientProxy.emit('reserve-ticket', id);
    await this.redisService.delKeyCache(`ticket:${id}`);
    await this.redisService.delKeyCache('ticket:all');
  }

  @UseGuards(RateLimitGuard)
  @UseInterceptors(LockInterceptor)
  @HttpCode(202)
  @Patch(':id/cancelReserve-ticket')
  async cancelReserve(@Param('id') id: string) {
    this.serviceTicketclientProxy.emit('cancelReserve-ticket', id);
    await this.redisService.delKeyCache(`ticket:${id}`);
    await this.redisService.delKeyCache('ticket:all');
    return;
  }
}
