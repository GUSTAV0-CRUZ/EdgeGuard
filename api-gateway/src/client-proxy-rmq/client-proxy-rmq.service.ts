import { Injectable } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

@Injectable()
export class ClientProxyRmqService {
  getServiceTicketclientProxy() {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [String(process.env.RABBITMQ_URL)],
        queue: 'service-ticket',
        queueOptions: {
          durable: true,
        },
      },
    });
  }
}
