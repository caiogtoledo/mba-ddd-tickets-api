import { Cpf } from '../../..//shared/domain/value-objects/cpf.vo';
import { AggregateRoot } from '../../../shared/domain/aggregate-root';
import { Name } from '../../../shared/domain/value-objects/name.vo';
import Uuid from '../../../shared/domain/value-objects/uuid.vo';

export class CustomerId extends Uuid {}

export type CustomerConstructorProps = {
  id?: CustomerId | string;
  cpf: Cpf;
  name: Name;
};

export class Customer extends AggregateRoot<CustomerConstructorProps> {
  id: CustomerId | string; // conveniente para o banco de dados
  cpf: Cpf;
  name: Name;

  constructor(props: CustomerConstructorProps) {
    super();
    this.id =
      typeof props.id! === 'string'
        ? new CustomerId(props.id!)
        : (props.id ?? new CustomerId());
    this.cpf = props.cpf;
    this.name = props.name!;
  }

  static create(command: { name: Name; cpf: Cpf }) {
    return new Customer(command);
  }

  toJSON() {
    return {
      id: this.id,
      cpf: this.cpf,
      name: this.name,
    };
  }
}
