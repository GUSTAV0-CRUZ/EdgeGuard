import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Ticket } from '../entities/ticket.entitie';
import { StatusTicket } from '../enums/status-ticket.enum';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class TicketSchemaDb implements Ticket {
  @Prop({ type: Number, required: true, unique: true })
  number!: number;

  @Prop({ enum: StatusTicket, type: String, default: StatusTicket.AVAILABLE })
  status!: StatusTicket;
}

export type TicketSchemaDocument = Document & TicketSchemaDb;

export const TicketSchema = SchemaFactory.createForClass(TicketSchemaDb);
