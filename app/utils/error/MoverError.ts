import axios from 'axios';
import { CustomError } from 'ts-custom-error';

import { addSentryBreadcrumb } from '../../logs/sentry';

export class MoverError extends CustomError {
  protected payload?: Record<string, unknown>;

  protected wrappedError?: Error;

  protected originalMessage: string;

  constructor(message: string, payload?: Record<string, unknown>) {
    super(message);
    this.originalMessage = message;
    this.payload = payload;
  }

  public formatMessage(wrappedError?: Error): string {
    const baseString = this.message;
    if (wrappedError === undefined) {
      return baseString;
    }

    let wrappedErrorString;
    if (wrappedError instanceof MoverError) {
      wrappedErrorString = wrappedError.formatMessage();
    } else if (axios.isAxiosError(wrappedError)) {
      wrappedErrorString = JSON.stringify(wrappedError.toJSON());
    } else {
      wrappedErrorString = wrappedError?.message ?? wrappedError.toString();
    }

    return `${baseString}: ${wrappedErrorString}`;
  }

  public wrap(error: unknown): this {
    if (!(error instanceof Error)) {
      this.setPayload({
        previousPayload: this.payload,
        wrapped: error
      });
      return this;
    }

    this.message = this.formatMessage(error);
    this.wrappedError = error;
    return this;
  }

  public setPayload(payload: Record<string, unknown>): this {
    this.payload = payload;
    return this;
  }

  public getPayload(): Record<string, unknown> | undefined {
    return this.payload;
  }

  public getWrappedError(): Error | undefined {
    return this.wrappedError;
  }

  public getOriginalMessage(): string {
    return this.originalMessage;
  }

  public addToBreadcrumb(): void {
    addSentryBreadcrumb({
      type: 'error',
      category: 'mover.error',
      message: this.originalMessage,
      data: {
        payload: this.payload,
        wrappedError: this.wrappedError
      }
    });
  }
}
