import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    // If this is already an RpcException, just return it
    if (exception instanceof RpcException) {
      return throwError(() => exception);
    }

    // For HTTP exceptions from @nestjs/common (like NotFoundException)
    if (exception.getStatus && typeof exception.getStatus === 'function') {
      const status = exception.getStatus();
      const response = exception.getResponse();

      const error = {
        message: response.message || exception.message,
        statusCode: status,
      };

      return throwError(() => new RpcException(error));
    }

    // For regular errors, return a generic RpcException
    return throwError(
      () =>
        new RpcException({
          message: exception.message || 'Internal server error',
          statusCode: 500,
        }),
    );
  }
}
