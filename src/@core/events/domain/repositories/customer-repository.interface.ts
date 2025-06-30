import { IRepository } from '../../../shared/domain/repository-interface';
import { Customer } from '../entities/customer.entity';

export interface CustomerRepositoryInterface extends IRepository<Customer> {}
