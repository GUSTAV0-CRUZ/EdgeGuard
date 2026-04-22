import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const req = host.switchToHttp().getRequest<Request>();
    const res = host.switchToHttp().getResponse<Response>();

    let message: Array<string> = [
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      (exception?.message ?? 'Internal server error') as string,
    ];
    let status: number = HttpStatus.BAD_REQUEST;

    if (exception instanceof HttpException) {
      message = [exception.message];
      status = exception.getStatus();
    }

    if (String(message).toLocaleLowerCase().includes('not found')) {
      status = HttpStatus.NOT_FOUND;
    }

    res.status(status).json({
      method: req.method,
      path: req.path,
      status,
      message,
    });
  }
}
