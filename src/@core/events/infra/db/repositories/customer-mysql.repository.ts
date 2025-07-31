import { ICustomerRepository } from '../../../../events/domain/repositories/customer-repository.interface';
import { Customer, CustomerId } from '../../../domain/entities/customer.entity';
import { EntityManager } from '@mikro-orm/mysql';
import { CustomerSchema } from '../schemas';

export class CustomerMysqlRepository implements ICustomerRepository {
  constructor(private readonly em: EntityManager) {}

  async add(entity: Customer): Promise<void> {
    let schema = await this.em.findOne(CustomerSchema, {
      id: entity.id.value,
    });
    if (schema) {
      schema.name = entity.name;
    } else {
      schema = CustomerSchema.fromDomain(entity);
      this.em.persist(schema);
    }
  }

  async findById(id: string | CustomerId): Promise<Customer | null> {
    const schema = await this.em.findOne(CustomerSchema, {
      id: typeof id === 'string' ? id : id.value,
    });
    return schema ? schema.toDomain() : null;
  }

  async findAll(): Promise<Customer[]> {
    const schemas = await this.em.find(CustomerSchema, {});
    return schemas.map((schema) => schema.toDomain());
  }

  async delete(entity: Customer): Promise<void> {
    const schema = await this.em.findOne(CustomerSchema, {
      id: entity.id!.valueOf() ?? '',
    });
    if (schema) {
      this.em.remove(schema);
    }
  }
}
