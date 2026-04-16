import { StatusTicket } from '../enums/status-ticket.enum';

export class Ticket {
  id?: string;
  status!: StatusTicket;
  number!: number;
  createdAt?: Date;
  updatedAt?: Date;
}
