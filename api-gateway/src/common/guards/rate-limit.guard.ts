import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { RedisService } from '../../redis/redis.service';

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(private readonly redisService: RedisService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const ip = req.ip;

    if (!ip) throw new HttpException('ivalid ip', 400);

    const elemetKey = ip;

    try {
      await this.redisService.rateLimit(elemetKey, 6, 60);
      return true;
    } catch (error: any) {
      if (!(error instanceof HttpException))
        throw new HttpException('Internal Serve Error', 500);

      throw new HttpException(error.message, error.getStatus());
    }
  }
}
