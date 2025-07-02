import { Cpf } from '../../..//shared/domain/value-objects/cpf.vo';
import { AggregateRoot } from '../../../shared/domain/aggregate-root';
import Uuid from '../../../shared/domain/value-objects/uuid.vo';

export class CustomerId extends Uuid {}

export type CustomerConstructorProps = {
  id?: CustomerId;
  cpf: Cpf;
  name: string;
};

export class Customer extends AggregateRoot<CustomerConstructorProps> {
  id: CustomerId;
  cpf: Cpf;
  name: string;

  constructor(props: CustomerConstructorProps) {
    super();
    this.id =
      typeof props.id! === 'string'
        ? new CustomerId(props.id!)
        : (props.id ?? new CustomerId());
    this.cpf = props.cpf;
    this.name = props.name!;
  }

  static create(command: { name: string; cpf: Cpf }) {
    return new Customer(command);
  }

  changeName(name: string) {
    this.name = name;
  }

  toJSON() {
    return {
      id: this.id,
      cpf: this.cpf,
      name: this.name,
    };
  }
}
