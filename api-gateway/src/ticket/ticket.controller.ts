import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { CreateTicketDto } from './dtos/create-ticket.dto';
import { ClientProxyRmqService } from '../client-proxy-rmq/client-proxy-rmq.service';
import { ClientProxy } from '@nestjs/microservices';
import { ApiResponse } from '@nestjs/swagger';
import { ResponseTicketDto } from './dtos/response-ticket.dto';

@Controller('ticket')
export class TicketController {
  private readonly serviceTicketclientProxy: ClientProxy;

  constructor(ticketService: ClientProxyRmqService) {
    this.serviceTicketclientProxy = ticketService.getServiceTicketclientProxy();
  }

  @HttpCode(202)
  @Post()
  create(@Body() createTicketDto: CreateTicketDto) {
    return this.serviceTicketclientProxy.emit('create-ticket', createTicketDto);
  }

  @ApiResponse({
    status: 200,
    type: [ResponseTicketDto],
  })
  @Get()
  findAll() {
    return this.serviceTicketclientProxy.send('findAll-ticket', '');
  }

  @ApiResponse({
    status: 200,
    type: ResponseTicketDto,
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serviceTicketclientProxy.send('findOne-ticket', id);
  }

  // @EventPattern('delete-ticket')
  // async delete(@Payload() id: string, @Ctx() ctx: RmqContext) {
  //   const channel = ctx.getChannelRef() as Channel;
  //   const originalMsg = ctx.getMessage() as Message;

  //   try {
  //     await this.ticketService.delete(id);
  //     channel.ack(originalMsg);
  //   } catch (error: any) {
  //     catchResilienceMessage(error, channel, originalMsg);
  //   }
  // }

  // @EventPattern('reserve-ticket')
  // async reserve(@Payload() id: string, @Ctx() ctx: RmqContext) {
  //   const channel = ctx.getChannelRef() as Channel;
  //   const originalMsg = ctx.getMessage() as Message;

  //   try {
  //     await this.ticketService.reserve(id);
  //     channel.ack(originalMsg);
  //   } catch (error: any) {
  //     catchResilienceMessage(error, channel, originalMsg);
  //   }
  // }

  // @EventPattern('cancelReserve-ticket')
  // async cancelReserve(@Payload() id: string, @Ctx() ctx: RmqContext) {
  //   const channel = ctx.getChannelRef() as Channel;
  //   const originalMsg = ctx.getMessage() as Message;

  //   try {
  //     await this.ticketService.cancelReserve(id);
  //     channel.ack(originalMsg);
  //   } catch (error: any) {
  //     catchResilienceMessage(error, channel, originalMsg);
  //   }
  // }
}
