import { MoverError } from 'app/services/MoverError';

export class MoverAPIError extends MoverError {
  constructor(
    readonly message: string,
    readonly shortMessage?: string,
    readonly payload?: Record<string, unknown>
  ) {
    super(message, payload);
  }
}
