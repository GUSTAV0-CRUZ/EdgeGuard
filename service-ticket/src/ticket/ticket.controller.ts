import { Controller } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { Channel, Message } from 'amqplib';
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dtos/create-ticket.dto';

@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @EventPattern('create-ticket')
  async create(
    @Payload() createTicketDto: CreateTicketDto,
    @Ctx() ctx: RmqContext,
  ) {
    const channel = ctx.getChannelRef() as Channel;
    const originalMsg = ctx.getMessage() as Message;

    try {
      await this.ticketService.create(createTicketDto);
      channel.ack(originalMsg);
    } catch (error: any) {
      channel.ack(originalMsg);
      throw error;
    }
  }

  @MessagePattern('findAll-ticket')
  async findAll(@Ctx() ctx: RmqContext) {
    const channel = ctx.getChannelRef() as Channel;
    const originalMsg = ctx.getMessage() as Message;

    try {
      await this.ticketService.findAll();
      channel.ack(originalMsg);
    } catch (error: any) {
      channel.ack(originalMsg);
      throw error;
    }
  }

  @MessagePattern('findOne-ticket')
  async findOne(@Payload() id: string, @Ctx() ctx: RmqContext) {
    const channel = ctx.getChannelRef() as Channel;
    const originalMsg = ctx.getMessage() as Message;

    try {
      await this.ticketService.findOne(id);
      channel.ack(originalMsg);
    } catch (error: any) {
      channel.ack(originalMsg);
      throw error;
    }
  }

  @EventPattern('delete-ticket')
  async delete(@Payload() id: string, @Ctx() ctx: RmqContext) {
    const channel = ctx.getChannelRef() as Channel;
    const originalMsg = ctx.getMessage() as Message;

    try {
      await this.ticketService.delete(id);
      channel.ack(originalMsg);
    } catch (error: any) {
      channel.ack(originalMsg);
      throw error;
    }
  }

  @EventPattern('reserve-ticket')
  async reserve(@Payload() id: string, @Ctx() ctx: RmqContext) {
    const channel = ctx.getChannelRef() as Channel;
    const originalMsg = ctx.getMessage() as Message;

    try {
      await this.ticketService.reserve(id);
      channel.ack(originalMsg);
    } catch (error: any) {
      channel.ack(originalMsg);
      throw error;
    }
  }

  @EventPattern('cancelReserve-ticket')
  async cancelReserve(@Payload() id: string, @Ctx() ctx: RmqContext) {
    const channel = ctx.getChannelRef() as Channel;
    const originalMsg = ctx.getMessage() as Message;

    try {
      await this.ticketService.cancelReserve(id);
      channel.ack(originalMsg);
    } catch (error: any) {
      channel.ack(originalMsg);
      throw error;
    }
  }
}
