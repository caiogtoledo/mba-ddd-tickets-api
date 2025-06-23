import { ValueObject } from './value-object';

export class Cpf extends ValueObject<string> {
  constructor(value: string) {
    super(value);
    this.validate(value);
  }

  private validate(value: string): void {
    if (!value || !/^\d{11}$/.test(value)) {
      throw new Error('CPF must be a string of 11 digits.');
    }
  }
}
