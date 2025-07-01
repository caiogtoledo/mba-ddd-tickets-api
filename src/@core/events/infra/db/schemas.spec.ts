import { MikroORM, MySqlDriver } from '@mikro-orm/mysql';
import { PartnerSchema } from './schemas';
import { Partner } from '../../domain/entities/partner.entity';

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

  await orm.schema.dropSchema();
  await orm.schema.refreshDatabase();

  const em = orm.em.fork();

  const partner = Partner.create({
    name: 'Test Partner',
  });

  // Converta para schema antes de persistir
  const partnerSchema = PartnerSchema.fromDomain(partner);

  em.persist(partnerSchema);

  await em.flush();
  await em.clear();

  // Busque usando o schema
  const partnerFound = await em.findOne(PartnerSchema, {
    name: partner.name,
  });

  // Converta de volta para domínio se necessário
  const partnerDomain = partnerFound ? partnerFound.toDomain() : null;

  console.log(partnerDomain);

  await orm.close();
});
