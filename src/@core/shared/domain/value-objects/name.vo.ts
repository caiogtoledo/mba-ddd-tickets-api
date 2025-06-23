import { ValueObject } from './value-object';

export class Name extends ValueObject<string> {
  constructor(value: string) {
    super(value);
    this.validate(value);
  }

  private validate(value: string): void {
    if (!value || value.length < 3) {
      throw new Error('Name must be at least 3 characters long.');
    }
  }

  static create(name: string): Name {
    return new Name(name);
  }
}
