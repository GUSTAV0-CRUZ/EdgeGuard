import { Logger } from '@nestjs/common';

export function loggerError(logger: Logger, methodName: string, param: any) {
  return logger.log({
    method: methodName,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    param,
  });
}
