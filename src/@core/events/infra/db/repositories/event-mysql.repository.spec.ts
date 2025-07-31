import { MikroORM, MySqlDriver, EntityManager } from '@mikro-orm/mysql';
import { EventMysqlRepository } from './event-mysql.repository';
import {
  CustomerSchema,
  EventSchema,
  EventSectionSchema,
  EventSpotSchema,
  PartnerSchema,
} from '../schemas';
import { PartnerMysqlRepository } from './partner-mysql.repository';
import { Partner } from '../../../../events/domain/entities/partner.entity';

describe.skip('EventMysqlRepository', () => {
  let orm: MikroORM;
  let em: EntityManager;
  let eventRepo: EventMysqlRepository;
  let partnerRepo: PartnerMysqlRepository;

  beforeEach(async () => {
    orm = await MikroORM.init<MySqlDriver>({
      entities: [
        EventSchema,
        EventSectionSchema,
        EventSpotSchema,
        PartnerSchema,
        CustomerSchema,
      ],
      dbName: 'events-eventrepotest',
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
    eventRepo = new EventMysqlRepository(em);
    partnerRepo = new PartnerMysqlRepository(em);
  });

  afterEach(async () => {
    await orm.close();
  });

  test('deve criar um Event no banco', async () => {
    const partner = Partner.create({ name: 'Partner 1' });
    await partnerRepo.add(partner);
    const event =
      partner.initEvent({
        name: 'Event 1',
        date: new Date(),
        description: 'Event 1 description',
      }) || {};

    event.addSection?.({
      name: 'Section 1',
      description: 'Section 1 description',
      price: 100,
      total_spots: 15,
    });

    await eventRepo.add(event);
    await em.flush();
    await em.clear();

    const eventFound = await eventRepo.findById(event.id);
    console.log(eventFound);
  });
});
