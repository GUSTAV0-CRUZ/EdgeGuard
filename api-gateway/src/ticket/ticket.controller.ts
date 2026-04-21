import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
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

  @HttpCode(202)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.serviceTicketclientProxy.emit('delete-ticket', id);
  }

  @HttpCode(202)
  @Patch(':id/reserve-ticket')
  reserve(@Param('id') id: string) {
    return this.serviceTicketclientProxy.emit('reserve-ticket', id);
  }

  @HttpCode(202)
  @Patch(':id/cancelReserve-ticket')
  cancelReserve(@Param('id') id: string) {
    return this.serviceTicketclientProxy.emit('cancelReserve-ticket', id);
  }
}
