/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { TicketService } from './ticket.service';
import { TicketRepository } from './repository/ticket.repository';
import { StatusTicket } from './enums/status-ticket.enum';
import { RpcException } from '@nestjs/microservices';

const createTicket = (id?: string, status?: StatusTicket, number?: number) => {
  return {
    _id: id ?? 'id123',
    status: status ?? StatusTicket.AVAILABLE,
    number: number ?? 1,
  };
};

describe('TicketService', () => {
  let ticketService: TicketService;
  let ticketRepository: TicketRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketService,
        {
          provide: TicketRepository,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    ticketService = module.get<TicketService>(TicketService);
    ticketRepository = module.get<TicketRepository>(TicketRepository);
  });

  it('should be defined', () => {
    expect(ticketService).toBeDefined();
  });

  describe('create', () => {
    it('should return Ticket created', async () => {
      const createDto = { number: 1 };
      const ticket = createTicket(undefined, undefined, createDto.number);

      jest.spyOn(ticketRepository, 'create').mockResolvedValue(ticket as any);

      const result = await ticketService.create(createDto);

      expect(ticketRepository.create).toHaveBeenCalledWith({
        number: createDto.number,
      });
      expect(result).toEqual(ticket);
    });

    it('should return error: duplicate key', async () => {
      const customError = new Error();
      customError['message'] = '... duplicate key ...';

      jest.spyOn(ticketRepository, 'create').mockImplementation(() => {
        throw customError;
      });

      await expect(ticketService.create({} as any)).rejects.toThrow(
        'Key "number" is duplicate',
      );
    });

    it('should return generic error', async () => {
      jest.spyOn(ticketRepository, 'create').mockImplementation(() => {
        throw new Error();
      });

      await expect(ticketService.create({} as any)).rejects.toThrow(
        RpcException,
      );
    });
  });
});
