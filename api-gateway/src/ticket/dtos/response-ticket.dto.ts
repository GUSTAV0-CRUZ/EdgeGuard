import { ApiProperty } from '@nestjs/swagger';
import { StatusTicket } from '../enums/status-ticket.enum';

export class ResponseTicketDto {
  @ApiProperty({ example: '69e2d01493a06862742e0a84' })
  _id!: string;

  @ApiProperty({ example: 2 })
  number!: number;

  @ApiProperty({ enum: StatusTicket })
  status!: StatusTicket;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
