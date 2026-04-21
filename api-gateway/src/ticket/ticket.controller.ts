import { Body, Controller, Post } from '@nestjs/common';
import { CreateTicketDto } from './dtos/create-ticket.dto';
import { ClientProxyRmqService } from '../client-proxy-rmq/client-proxy-rmq.service';
import { ClientProxy } from '@nestjs/microservices';

@Controller('ticket')
export class TicketController {
  private readonly serviceTicketclientProxy: ClientProxy;

  constructor(ticketService: ClientProxyRmqService) {
    this.serviceTicketclientProxy = ticketService.getServiceTicketclientProxy();
  }

  @Post()
  create(@Body() createTicketDto: CreateTicketDto) {
    return this.serviceTicketclientProxy.emit('create-ticket', createTicketDto);
  }

  // @MessagePattern('findAll-ticket')
  // async findAll(@Ctx() ctx: RmqContext) {
  //   const channel = ctx.getChannelRef() as Channel;
  //   const originalMsg = ctx.getMessage() as Message;

  //   try {
  //     const tickets = await this.ticketService.findAll();
  //     channel.ack(originalMsg);
  //     return tickets;
  //   } catch (error: any) {
  //     catchResilienceMessage(error, channel, originalMsg);
  //   }
  // }

  // @MessagePattern('findOne-ticket')
  // async findOne(@Payload() id: string, @Ctx() ctx: RmqContext) {
  //   const channel = ctx.getChannelRef() as Channel;
  //   const originalMsg = ctx.getMessage() as Message;

  //   try {
  //     const ticket = await this.ticketService.findOne(id);
  //     channel.ack(originalMsg);
  //     return ticket;
  //   } catch (error: any) {
  //     catchResilienceMessage(error, channel, originalMsg);
  //   }
  // }

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
