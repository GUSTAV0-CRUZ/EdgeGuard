import { Logger } from '@nestjs/common';

export function loggerError(logger: Logger, methodName: string, error: any) {
  if (!(error instanceof Error))
    return logger.error('Unusual error in method: ', methodName);
  return logger.error({
    method: methodName,
    message: String(error.message),
    stackTrace: error.stack,
  });
}
