import { Injectable, Logger } from '@nestjs/common';
import { CreateTicketDto } from './dtos/create-ticket.dto';
import { UpdateTicketDto } from './dtos/update-ticket.dto';
import { RpcException } from '@nestjs/microservices';
import { Ticket } from './entities/ticket.entitie';
import { TicketRepository } from './repository/ticket.repository';
import { loggerMethod } from '../utils/logger-method';
import { loggerError } from '../utils/logger-error';

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

  private async update(id: string, updateTicketDto: UpdateTicketDto) {}

  async delete(id: string) {}

  async reserve(id: string) {}

  async cancelReserve(id: string) {}
}
