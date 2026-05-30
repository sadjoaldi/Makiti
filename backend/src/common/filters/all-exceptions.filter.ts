import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Détermine le status HTTP
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Message d'erreur
    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Erreur interne du serveur';

    // Log SANS le body (qui peut contenir password, otp, etc.)
    // On logge uniquement : méthode, route, status, message
    const logContext = `${request.method} ${request.url} → ${status}`;

    if (status >= 500) {
      // Erreurs serveur : log complet avec stack pour debug
      this.logger.error(
        logContext,
        exception instanceof Error ? exception.stack : String(exception),
      );
    } else {
      // Erreurs client (4xx) : log léger
      this.logger.warn(
        `${logContext} — ${typeof message === 'string' ? message : JSON.stringify(message)}`,
      );
    }

    // Réponse au client
    response.status(status).json(
      typeof message === 'object'
        ? message
        : {
            statusCode: status,
            message,
            timestamp: new Date().toISOString(),
            path: request.url,
          },
    );
  }
}
