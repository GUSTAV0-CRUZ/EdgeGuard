import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { StatusTicket } from '../enums/status-ticket.enum';

export class UpdateTicketDto {
  @IsNumber()
  @IsOptional()
  number?: number;

  @IsEnum(StatusTicket)
  @IsOptional()
  status?: StatusTicket;
}
