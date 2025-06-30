import { CustomerRepositoryInterface } from '../../../../events/domain/repositories/customer-repository.interface';
import { Customer, CustomerId } from '../../../domain/entities/customer.entity';
import { EntityManager } from '@mikro-orm/mysql';

export class CustomerMysqlRepository implements CustomerRepositoryInterface {
  constructor(private readonly em: EntityManager) {}

  async add(entity: Customer): Promise<void> {
    this.em.persist(entity);
  }

  async findById(id: string | CustomerId): Promise<Customer | null> {
    return this.em.findOne(Customer, {
      id: typeof id === 'string' ? new CustomerId(id) : id,
    });
  }

  async findAll(): Promise<Customer[]> {
    return this.em.find(Customer, {});
  }

  async delete(entity: Customer): Promise<void> {
    this.em.remove(entity);
  }
}
