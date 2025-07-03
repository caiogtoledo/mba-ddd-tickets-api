import { EntityManager, MikroORM, MySqlDriver } from '@mikro-orm/mysql';
import { CustomerMysqlRepository } from '../infra/db/repositories/customer-mysql.repository';
import { CustomerSchema } from '../infra/db/schemas';
import { Customer } from '../domain/entities/customer.entity';
import { CustomerService } from './customer.service';

describe('CustomerService', () => {
  let orm: MikroORM;
  let em: EntityManager;
  let customerRepo: CustomerMysqlRepository;

  beforeEach(async () => {
    orm = await MikroORM.init<MySqlDriver>({
      entities: [CustomerSchema],
      dbName: 'events-customerservice',
      user: 'root',
      password: 'root',
      host: 'localhost',
      port: 3306,
      forceEntityConstructor: true,
      ensureDatabase: true,
    });

    await orm.schema.dropSchema();

    await orm.schema.refreshDatabase();

    em = orm.em.fork();
  });

  afterEach(async () => {
    await orm.close();
  });

  test('should list customers', async () => {
    const customerRepo = new CustomerMysqlRepository(em);
    const customerService = new CustomerService(customerRepo);

    const customer = Customer.create({
      cpf: '24171862094',
      name: 'John Doe',
    });

    await customerRepo.add(customer);
    await em.flush();
    await em.clear();

    const customers = await customerService.list();

    console.log(customers);

    expect(customers).toHaveLength(1);

    expect(customers[0].cpf.value).toBe('24171862094');
    expect(customers[0].name).toBe('John Doe');
  });

  test('should register customer', async () => {
    const customerRepo = new CustomerMysqlRepository(em);
    const customerService = new CustomerService(customerRepo);

    const customer = Customer.create({
      cpf: '24171862094',
      name: 'John Doe',
    });

    await customerService.register({
      name: customer.name,
      cpf: customer.cpf.value,
    });

    await em.clear();
  });
});
