import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Response } from 'express';

/**
 * Global exception filter for the API Gateway
 *
 * This filter handles all exceptions thrown by the application and formats them into a standardized response.
 * It specifically handles RPC exceptions from microservices and translates them to appropriate HTTP responses.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    this.logger.error(
      `Exception caught: ${exception.message}`,
      exception.stack,
    );

    // Check if this is an error response from a microservice
    if (exception.message && typeof exception.message === 'object') {
      const error = exception.message;
      const statusCode = error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
      const message = error.message || 'Internal server error';

      return response.status(statusCode).json({
        statusCode,
        message,
        timestamp: new Date().toISOString(),
        path: ctx.getRequest().url,
      });
    }

    // Handle RpcException
    if (exception instanceof RpcException) {
      const error = exception.getError();
      const statusCode =
        error['statusCode'] || HttpStatus.INTERNAL_SERVER_ERROR;
      const message =
        typeof error === 'string'
          ? error
          : error['message'] || 'Internal server error';

      return response.status(statusCode).json({
        statusCode,
        message,
        timestamp: new Date().toISOString(),
        path: ctx.getRequest().url,
      });
    }

    // Handle standard HTTP exceptions
    const status =
      exception.status ||
      exception.statusCode ||
      HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      exception.response?.message ||
      exception.message ||
      'Internal server error';

    response.status(status).json({
      statusCode: status,
      message: Array.isArray(message) ? message : [message],
      timestamp: new Date().toISOString(),
      path: ctx.getRequest().url,
    });
  }
}
