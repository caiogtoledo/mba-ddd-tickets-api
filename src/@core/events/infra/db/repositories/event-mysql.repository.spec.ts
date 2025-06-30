import { MikroORM, MySqlDriver, EntityManager } from '@mikro-orm/mysql';
import { EventMysqlRepository } from './event-mysql.repository';
import {
  EventSchema,
  EventSectionSchema,
  EventSpotSchema,
  PartnerSchema,
} from '../schemas';
import { Event } from '../../../domain/entities/event.entity';
import { PartnerMysqlRepository } from './partner-mysql.repository';
import { Partner } from '../../../../events/domain/entities/partner.entity';

describe('EventMysqlRepository', () => {
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
      ],
      dbName: 'events',
      user: 'root',
      password: 'root',
      host: 'localhost',
      port: 3306,
      forceEntityConstructor: true,
    });

    await orm.schema.refreshDatabase();
    em = orm.em.fork();
    eventRepo = new EventMysqlRepository(em);
    partnerRepo = new PartnerMysqlRepository(em);
  });

  afterEach(async () => {
    await orm.close();
  });

  test('deve criar um Event no banco', async () => {
    const partner = Partner.create({
      name: 'Test Partner',
    });

    await partnerRepo.add(partner);

    const event = partner.initEvent({
      name: 'Event 1',
      date: new Date(),
      description: 'Event 1 description',
    });

    await eventRepo.add(event);
  });

  // test('deve buscar todos os Events', async () => {
  //   const event1 = Event.create({
  //     name: 'Event 1',
  //   });
  //   const event2 = Event.create({
  //     name: 'Event 2',
  //   });

  //   await eventRepo.add(event1);
  //   await eventRepo.add(event2);
  //   await em.flush();
  //   await em.clear();

  //   const Events = await eventRepo.findAll();

  //   expect(Events).toHaveLength(2);
  //   expect(Events.map((p) => p.name)).toEqual(
  //     expect.arrayContaining(['Event 1', 'Event 2']),
  //   );
  // });

  // test('deve deletar um Event', async () => {
  //   const event = Event.create({
  //     name: 'Test Event',
  //     cpf: new Cpf('24171862094'),
  //   });
  //   await eventRepo.add(event);
  //   await em.flush();
  //   await em.clear();

  //   const found = await eventRepo.findById(event.id);
  //   expect(found).toBeInstanceOf(Event);

  //   await eventRepo.delete(event);
  //   await em.flush();
  //   await em.clear();

  //   const deleted = await eventRepo.findById(event.id);
  //   expect(deleted).toBeNull();
  // });
});
