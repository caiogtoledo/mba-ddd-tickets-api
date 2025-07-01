import { MikroORM, MySqlDriver, EntityManager } from '@mikro-orm/mysql';
import { CustomerMysqlRepository } from './customer-mysql.repository';
import { CustomerSchema } from '../schemas';
import { Customer } from '../../../domain/entities/customer.entity';
import { Cpf } from '../../../../shared/domain/value-objects/cpf.vo';

describe('CustomerMysqlRepository', () => {
  let orm: MikroORM;
  let em: EntityManager;
  let customerRepo: CustomerMysqlRepository;

  beforeEach(async () => {
    orm = await MikroORM.init<MySqlDriver>({
      entities: [CustomerSchema],
      dbName: 'events',
      user: 'root',
      password: 'root',
      host: 'localhost',
      port: 3306,
      forceEntityConstructor: true,
    });

    await orm.schema.refreshDatabase();
    em = orm.em.fork();
    customerRepo = new CustomerMysqlRepository(em);
  });

  afterEach(async () => {
    await orm.close();
  });

  test('deve criar e atualizar um Customer no banco', async () => {
    const customer = Customer.create({
      name: 'Test Customer',
      cpf: new Cpf('24171862094'),
    });
    await customerRepo.add(customer);

    await em.clear();

    const found = await customerRepo.findById(customer.id);

    expect(found).toBeInstanceOf(Customer);
    expect(found?.name).toBe('Test Customer');
    expect(found?.cpf.value).toBe('24171862094');

    found!.changeName('Updated Customer Name');
    await customerRepo.add(found!);

    await em.clear();

    const updated = await customerRepo.findById(customer.id);

    expect(updated).toBeInstanceOf(Customer);
    expect(updated?.name).toBe('Updated Customer Name');
  });

  test('deve buscar todos os Customers', async () => {
    const customer1 = Customer.create({
      name: 'Customer 1',
      cpf: new Cpf('24171862094'),
    });
    const customer2 = Customer.create({
      name: 'Customer 2',
      cpf: new Cpf('00557663075'),
    });

    await customerRepo.add(customer1);
    await customerRepo.add(customer2);
    await em.flush();
    await em.clear();

    const Customers = await customerRepo.findAll();

    expect(Customers).toHaveLength(2);
    expect(Customers.map((p) => p.name)).toEqual(
      expect.arrayContaining(['Customer 1', 'Customer 2']),
    );
  });

  test('deve deletar um Customer', async () => {
    const customer = Customer.create({
      name: 'Test Customer',
      cpf: new Cpf('24171862094'),
    });
    await customerRepo.add(customer);
    await em.flush();
    await em.clear();

    const found = await customerRepo.findById(customer.id);
    expect(found).toBeInstanceOf(Customer);

    await customerRepo.delete(customer);
    await em.flush();
    await em.clear();

    const deleted = await customerRepo.findById(customer.id);
    expect(deleted).toBeNull();
  });
});
