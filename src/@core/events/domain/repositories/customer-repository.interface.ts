import { IRepository } from '../../../shared/domain/repository-interface';
import { Customer } from '../entities/customer.entity';

export interface ICustomerRepository extends IRepository<Customer> {}
