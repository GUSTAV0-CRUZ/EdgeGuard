import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable } from 'rxjs';
import { RedisService } from '../../redis/redis.service';
import { Request } from 'express';

@Injectable()
export class LockInterceptor implements NestInterceptor {
  constructor(private redisService: RedisService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest<Request>();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const id = (req.params?.id || req.body?.id) as string | undefined;

    if (!id)
      throw new HttpException(
        'Resource ID is required for lock',
        HttpStatus.FORBIDDEN,
      );

    await this.redisService.acquireLock(id, 3);
    return next.handle().pipe(
      catchError(async (error: any) => {
        await this.redisService.releaseLock(id);
        throw error;
      }),
    );
  }
}
