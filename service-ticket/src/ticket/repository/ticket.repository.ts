import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TicketSchemaDocument } from '../schemas/ticket.schema';
import { CreateTicketDto } from '../dtos/create-ticket.dto';
import { UpdateTicketDto } from '../dtos/update-ticket.dto';

@Injectable()
export class TicketRepository {
  constructor(
    @InjectModel('Ticket')
    private readonly ticketModel: Model<TicketSchemaDocument>,
  ) {}

  findAll() {
    return this.ticketModel.find();
  }

  findOneById(id: string) {
    return this.ticketModel.findById(id);
  }

  create(createTicketDto: CreateTicketDto) {
    return this.ticketModel.create(createTicketDto);
  }

  update(id: string, updateTicketDto: UpdateTicketDto) {
    return this.ticketModel.findByIdAndUpdate(id, updateTicketDto, {
      returnDocument: 'after',
    });
  }

  delete(id: string) {
    return this.ticketModel.findByIdAndDelete(id);
  }
}
