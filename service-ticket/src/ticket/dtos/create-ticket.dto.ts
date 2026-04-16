import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { StatusTicket } from '../enums/status-ticket.enum';

export class CreateTicketDto {
  @IsNumber()
  @IsNotEmpty()
  number!: number;

  @IsEnum(StatusTicket)
  @IsOptional()
  status?: StatusTicket;
}
