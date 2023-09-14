import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { ErrorCode } from './error-code';
import { ErrorException } from './error-exception';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const hostType = host.getType();
    switch (hostType) {
      case 'http':
        return this.responseHttpError(exception, host);

      default:
        return null;
    }
  }

  private responseHttpError(exception: any, host: ArgumentsHost) {
    let errorException: ErrorException;
    let httpStatusCode: number;

    if (exception instanceof ErrorException) {
      errorException = exception;
      httpStatusCode = exception.httpStatusCode;
    } else {
      errorException = new ErrorException(
        ErrorCode.UNDEFINED_ERROR,
        exception.message ?? 'Undefined Error',
        exception.message,
      );

      httpStatusCode = exception.status ?? errorException.httpStatusCode;
    }

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    return response
      .setHeader('X-Error-Message', errorException.message)
      .setHeader('X-Error-Code', errorException.code)
      .status(httpStatusCode)
      .json(errorException.getErrors());
  }
}
