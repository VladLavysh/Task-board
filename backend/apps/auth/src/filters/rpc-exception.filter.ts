import {
  Catch,
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';

@Catch()
export class RpcExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost): Observable<any> {
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const response = exception.getResponse();
      message =
        typeof response === 'string'
          ? response
          : (response as any).message || message;
    } else if (exception instanceof RpcException) {
      const error = exception.getError();
      message =
        typeof error === 'string' ? error : (error as any).message || message;
      status = (error as any).statusCode || status;
    } else if (exception.message) {
      message = exception.message;
    }

    return throwError(() => ({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
    }));
  }
}
