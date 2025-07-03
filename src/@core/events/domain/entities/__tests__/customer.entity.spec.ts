import { Customer } from '../customer.entity';

test('should create a valid Customer entity', () => {
  const cpf = '12345678909'; // Valid CPF
  const name = 'John Doe';

  const customer = Customer.create({
    cpf: cpf,
    name: name,
  });

  expect(customer.cpf.value).toBe(cpf);
  expect(customer.name).toBe(name);
});
