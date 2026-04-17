import { Injectable, Logger } from '@nestjs/common';
import { CreateTicketDto } from './dtos/create-ticket.dto';
import { UpdateTicketDto } from './dtos/update-ticket.dto';
import { RpcException } from '@nestjs/microservices';
import { Ticket } from './entities/ticket.entitie';
import { TicketRepository } from './repository/ticket.repository';
import { loggerMethod } from '../utils/logger-method';
import { loggerError } from '../utils/logger-error';
import { StatusTicket } from './enums/status-ticket.enum';

@Injectable()
export class TicketService {
  private readonly logger = new Logger(TicketService.name);

  constructor(private readonly ticketRepository: TicketRepository) {}

  async create(createTicketDto: CreateTicketDto): Promise<Ticket> {
    loggerMethod(this.logger, this.create.name, createTicketDto);
    try {
      return await this.ticketRepository.create({
        number: createTicketDto.number,
      });
    } catch (error: any) {
      loggerError(this.logger, this.create.name, error);

      if (!(error instanceof Error)) throw new RpcException('Unusual error');

      if (String(error.message).toLowerCase().includes('duplicate key'))
        throw new RpcException('Key "number" is duplicate');

      throw new RpcException(error.message);
    }
  }

  async findAll(): Promise<Ticket[]> {
    loggerMethod(this.logger, this.findAll.name);
    try {
      return await this.ticketRepository.findAll();
    } catch (error: any) {
      loggerError(this.logger, this.findAll.name, error);

      if (!(error instanceof Error)) throw new RpcException('Unusual error');

      throw new RpcException(error.message);
    }
  }

  async findOne(id: string): Promise<Ticket> {
    loggerMethod(this.logger, this.findOne.name, id);
    try {
      const ticket = await this.ticketRepository.findOneById(id);

      if (!ticket) throw new RpcException('Ticket not found');

      return ticket;
    } catch (error: any) {
      loggerError(this.logger, this.findOne.name, error);

      if (!(error instanceof Error)) throw new RpcException('Unusual error');

      if (String(error.message).toLowerCase().includes('objectid failed'))
        throw new RpcException('error in format id');

      throw new RpcException(error.message);
    }
  }

  private async update(
    id: string,
    updateTicketDto: UpdateTicketDto,
  ): Promise<Ticket> {
    loggerMethod(this.logger, this.update.name, id);
    try {
      const ticket = await this.ticketRepository.update(id, updateTicketDto);

      if (!ticket) throw new RpcException('Ticket not found');

      return ticket;
    } catch (error: any) {
      loggerError(this.logger, this.update.name, error);

      if (!(error instanceof Error)) throw new RpcException('Unusual error');

      if (String(error.message).toLowerCase().includes('objectid failed'))
        throw new RpcException('error in format id');

      throw new RpcException(error.message);
    }
  }

  async delete(id: string) {
    loggerMethod(this.logger, this.delete.name, id);
    try {
      const ticket = await this.ticketRepository.delete(id);

      if (!ticket) throw new RpcException('Ticket not found');

      return ticket;
    } catch (error: any) {
      loggerError(this.logger, this.delete.name, error);

      if (!(error instanceof Error)) throw new RpcException('Unusual error');

      if (String(error.message).toLowerCase().includes('objectid failed'))
        throw new RpcException('error in format id');

      throw new RpcException(error.message);
    }
  }

  async reserve(id: string): Promise<Ticket> {
    loggerMethod(this.logger, this.reserve.name, id);
    try {
      const ticket = await this.findOne(id);

      if (ticket.status !== StatusTicket.AVAILABLE)
        throw new RpcException('Ticket not AVAILABLE');

      const ticketUpdated = await this.update(id, {
        status: StatusTicket.RESERVED,
      });

      return ticketUpdated;
    } catch (error: any) {
      loggerError(this.logger, this.reserve.name, error);

      if (!(error instanceof Error)) throw new RpcException('Unusual error');

      throw new RpcException(error.message);
    }
  }

  async cancelReserve(id: string) {
    loggerMethod(this.logger, this.cancelReserve.name, id);
    try {
      const ticket = await this.findOne(id);

      if (ticket.status !== StatusTicket.RESERVED)
        throw new RpcException('Ticket not RESERVED');

      const ticketUpdated = await this.update(id, {
        status: StatusTicket.AVAILABLE,
      });

      return ticketUpdated;
    } catch (error: any) {
      loggerError(this.logger, this.cancelReserve.name, error);

      if (!(error instanceof Error)) throw new RpcException('Unusual error');

      throw new RpcException(error.message);
    }
  }
}
