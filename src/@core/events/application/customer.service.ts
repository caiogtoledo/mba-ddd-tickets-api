import { Customer } from '../domain/entities/customer.entity';
import { ICustomerRepository } from '../domain/repositories/customer-repository.interface';

export class CustomerService {
  constructor(private customerRepo: ICustomerRepository) {}

  list() {
    return this.customerRepo.findAll();
  }

  register(input: { name: string; cpf: string }) {
    const customer = Customer.create(input);
    return this.customerRepo.add(customer);
  }
}
