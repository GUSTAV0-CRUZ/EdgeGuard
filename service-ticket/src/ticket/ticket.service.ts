import { Injectable } from '@nestjs/common';
import { CreateTicketDto } from './dtos/create-ticket.dto';
import { UpdateTicketDto } from './dtos/update-ticket.dto';

@Injectable()
export class TicketService {
  async create(createTicketDto: CreateTicketDto) {}

  async findAll() {}

  async findOne(id: string) {}

  private async update(id: string, updateTicketDto: UpdateTicketDto) {}

  async delete(id: string) {}

  async reserve(id: string) {}

  async cancelReserve(id: string) {}
}
