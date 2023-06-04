import { Response } from 'express';
import { AppError, HttpCode } from './AppErrors';

class ErrorHandler {
  private isTrustedError(error: Error): boolean {
    if (error instanceof AppError) {
      return error.isOperational;
    }
    return false;
  }

  public handleError(error: Error, response?: Response): void {
    if (this.isTrustedError(error) && response) {
      this.handleTrustedError(error as AppError, response);
    } else {
      this.handleCriticalError(error, response);
    }
  }

  private handleCriticalError(error: Error | AppError, response?: Response): void {
    if (response) {
      response
        .status(HttpCode.INTERNAL_SERVER_ERROR)
        .json({ message: 'Internal server error' });
    }

    console.log('Application encountered a critical error. Exiting');
    process.exit(1);
  }

  private handleTrustedError(error: AppError, response: Response): void {
    response.status(error.httpCode).json({ message: error.message });
  }
}

export const errorHandler = new ErrorHandler();