import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateTicketDto {
  @IsNumber()
  @IsNotEmpty()
  number!: number;
}
