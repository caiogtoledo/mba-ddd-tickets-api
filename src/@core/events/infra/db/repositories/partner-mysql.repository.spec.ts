import { MikroORM, MySqlDriver, EntityManager } from '@mikro-orm/mysql';
import { PartnerMysqlRepository } from './partner-mysql.repository';
import { PartnerSchema } from '../schemas';
import { Partner } from '../../../../events/domain/entities/partner.entity';

describe('PartnerMysqlRepository', () => {
  let orm: MikroORM;
  let em: EntityManager;
  let partnerRepo: PartnerMysqlRepository;

  beforeEach(async () => {
    orm = await MikroORM.init<MySqlDriver>({
      entities: [PartnerSchema],
      dbName: 'events',
      user: 'root',
      password: 'root',
      host: 'localhost',
      port: 3306,
      forceEntityConstructor: true,
    });

    await orm.schema.refreshDatabase();

    em = orm.em.fork();
    partnerRepo = new PartnerMysqlRepository(em);
  });

  afterEach(async () => {
    await orm.close();
  });

  test('deve criar e atualizar um partner no banco', async () => {
    const partner = Partner.create({ name: 'Test Partner' });
    await partnerRepo.add(partner);
    await em.flush();
    await em.clear();

    const found = await partnerRepo.findById(partner.id);

    expect(found).toBeInstanceOf(Partner);
    expect(found?.name).toBe('Test Partner');
    expect(found?.id.value).toBe(partner.id.value);

    partner.changeName('Updated Partner Name');
    await partnerRepo.add(partner);
    await em.flush();
    await em.clear();

    const updated = await partnerRepo.findById(partner.id);

    expect(updated).toBeInstanceOf(Partner);
    expect(updated?.name).toBe('Updated Partner Name');
  });

  test('deve buscar todos os partners', async () => {
    const partner1 = Partner.create({ name: 'Partner 1' });
    const partner2 = Partner.create({ name: 'Partner 2' });

    await partnerRepo.add(partner1);
    await partnerRepo.add(partner2);
    await em.flush();
    await em.clear();

    const partners = await partnerRepo.findAll();

    expect(partners).toHaveLength(2);
    expect(partners.map((p) => p.name)).toEqual(
      expect.arrayContaining(['Partner 1', 'Partner 2']),
    );
  });

  test('deve deletar um partner', async () => {
    const partner = Partner.create({ name: 'Test Partner' });
    await partnerRepo.add(partner);
    await em.flush();
    await em.clear();

    const found = await partnerRepo.findById(partner.id);
    expect(found).toBeInstanceOf(Partner);

    await partnerRepo.delete(partner);
    await em.flush();
    await em.clear();

    const deleted = await partnerRepo.findById(partner.id);
    expect(deleted).toBeNull();
  });
});
