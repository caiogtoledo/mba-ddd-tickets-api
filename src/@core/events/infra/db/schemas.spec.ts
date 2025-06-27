import { MikroORM, MySqlDriver } from '@mikro-orm/mysql';
import { PartnerSchema } from './schemas';
import { Partner } from '../../domain/entities/partner.entity';
import e from 'express';

test('deve criar um partner no banco', async () => {
  const orm = await MikroORM.init<MySqlDriver>({
    entities: [PartnerSchema],
    dbName: 'events',
    user: 'root',
    password: 'root',
    host: 'localhost',
    port: 3306,
    forceEntityConstructor: true,
  });

  await orm.schema.refreshDatabase();
  // Uso do fork para evitar conflitos com o cache do EntityManager
  const em = orm.em.fork();

  const partner = Partner.create({
    name: 'Test Partner',
  });

  em.persist(partner);

  await em.flush();
  await em.clear(); // limpa o cache do EntityManager (unit of work)

  const partnerFound = await em.findOne(Partner, {
    name: partner.name,
  });

  console.log(partnerFound);

  await orm.close();
});
