import { Name } from '../../../../shared/domain/value-objects/name.vo';
import { Cpf } from '../../../../shared/domain/value-objects/cpf.vo';
import { Customer } from '../customer.entity';

test('should create a valid Customer entity', () => {
  const cpf = '12345678909'; // Valid CPF
  const name = 'John Doe';

  const customer = Customer.create({
    cpf: new Cpf(cpf),
    name: new Name(name),
  });

  expect(customer.cpf.value).toBe(cpf);
  expect(customer.name.value).toBe(name);
});
