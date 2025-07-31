import { EntityManager, MikroORM, MySqlDriver } from '@mikro-orm/mysql';
import { CustomerMysqlRepository } from '../infra/db/repositories/customer-mysql.repository';
import { CustomerSchema } from '../infra/db/schemas';
import { Customer } from '../domain/entities/customer.entity';
import { CustomerService } from './customer.service';
import { UnitOfWorkMikroOrm } from '../../shared/infra/unit-of-work-mikro-orm';

describe('CustomerService', () => {
  let orm: MikroORM;
  let em: EntityManager;
  let unitOfWork: UnitOfWorkMikroOrm;
  let customerRepo: CustomerMysqlRepository;
  let customerService: CustomerService;

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
    unitOfWork = new UnitOfWorkMikroOrm(em);
    customerRepo = new CustomerMysqlRepository(em);
    customerService = new CustomerService(customerRepo, unitOfWork);
  });

  afterEach(async () => {
    await orm.close();
  });

  test('should list customers', async () => {
    const customer = Customer.create({
      cpf: '24171862094',
      name: 'John Doe',
    });

    await customerRepo.add(customer);
    await em.flush();
    em.clear();

    const customers = await customerService.list();

    console.log(customers);

    expect(customers).toHaveLength(1);

    expect(customers[0].cpf.value).toBe('24171862094');
    expect(customers[0].name).toBe('John Doe');
  });

  test('should register customer', async () => {
    const customer = await customerService.register({
      cpf: '24171862094',
      name: 'John Doe',
    });

    expect(customer).toBeInstanceOf(Customer);
    expect(customer.cpf.value).toBe('24171862094');
    expect(customer.name).toBe('John Doe');
    expect(customer.id).toBeDefined();

    await em.clear();

    const customerFound = await customerRepo.findById(customer.id);
    expect(customerFound).toBeDefined();
    expect(customerFound!.cpf.value).toBe('24171862094');
    expect(customerFound!.name).toBe('John Doe');
  });
});
