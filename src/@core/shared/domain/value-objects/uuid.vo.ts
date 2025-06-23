import { ValueObject } from './value-object';
import { randomUUID } from 'crypto';

export class Uuid extends ValueObject<string> {
  constructor(id?: string) {
    super(id || randomUUID());
    this.validate();
  }

  private validate(): void {
    if (
      !this.value ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        this.value,
      )
    ) {
      throw new Error('Invalid UUID format.');
    }
  }
}

export class InvalidUuidError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidUuidError';
  }
}

export default Uuid;
