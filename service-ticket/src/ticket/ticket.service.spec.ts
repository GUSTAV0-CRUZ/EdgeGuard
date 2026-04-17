/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { TicketService } from './ticket.service';
import { TicketRepository } from './repository/ticket.repository';
import { StatusTicket } from './enums/status-ticket.enum';
import { RpcException } from '@nestjs/microservices';

const createTicket = (id?: string, status?: StatusTicket, number?: number) => {
  return {
    _id: id ?? 'idTicket123',
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
            findAll: jest.fn(),
            findOneById: jest.fn(),
            delete: jest.fn(),
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

  describe('findAll', () => {
    it('should return array of Ticket', async () => {
      const ticket = createTicket();

      jest
        .spyOn(ticketRepository, 'findAll')
        .mockResolvedValue([ticket] as any);

      const result = await ticketService.findAll();

      expect(ticketRepository.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual([ticket]);
    });

    it('should return generic error', async () => {
      jest.spyOn(ticketRepository, 'findAll').mockImplementation(() => {
        throw new Error();
      });

      await expect(ticketService.findAll()).rejects.toThrow(RpcException);
    });
  });

  describe('findOne', () => {
    it('should return Ticket', async () => {
      const findOneArg = 'id123';
      const ticket = createTicket();

      jest
        .spyOn(ticketRepository, 'findOneById')
        .mockResolvedValue(ticket as any);

      const result = await ticketService.findOne(findOneArg);

      expect(ticketRepository.findOneById).toHaveBeenCalledWith(findOneArg);
      expect(result).toEqual(ticket);
    });

    it('should return error: Ticket not found', async () => {
      jest.spyOn(ticketRepository, 'findOneById').mockReturnValue(null as any);

      await expect(ticketService.findOne({} as any)).rejects.toThrow(
        'Ticket not found',
      );
    });

    it('should return error: error in format id', async () => {
      const customError = new Error();
      customError['message'] = '... objectId failed ...';

      jest.spyOn(ticketRepository, 'findOneById').mockImplementation(() => {
        throw customError;
      });

      await expect(ticketService.findOne({} as any)).rejects.toThrow(
        'error in format id',
      );
    });

    it('should return generic error', async () => {
      jest.spyOn(ticketRepository, 'findOneById').mockImplementation(() => {
        throw new Error();
      });

      await expect(ticketService.findOne({} as any)).rejects.toThrow(
        RpcException,
      );
    });
  });

  describe('delete', () => {
    it('should return deleted Ticket', async () => {
      const deleteArg = 'id123';
      const ticket = createTicket();

      jest.spyOn(ticketRepository, 'delete').mockResolvedValue(ticket as any);

      const result = await ticketService.delete(deleteArg);

      expect(ticketRepository.delete).toHaveBeenCalledWith(deleteArg);
      expect(result).toEqual(ticket);
    });

    it('should return error: Ticket not found', async () => {
      jest.spyOn(ticketRepository, 'delete').mockReturnValue(null as any);

      await expect(ticketService.delete({} as any)).rejects.toThrow(
        'Ticket not found',
      );
    });

    it('should return error: error in format id', async () => {
      const customError = new Error();
      customError['message'] = '... objectId failed ...';

      jest.spyOn(ticketRepository, 'delete').mockImplementation(() => {
        throw customError;
      });

      await expect(ticketService.delete({} as any)).rejects.toThrow(
        'error in format id',
      );
    });

    it('should return generic error', async () => {
      jest.spyOn(ticketRepository, 'delete').mockImplementation(() => {
        throw new Error();
      });

      await expect(ticketService.delete({} as any)).rejects.toThrow(
        RpcException,
      );
    });
  });
});
