import {
  Partner,
  PartnerId,
} from '../../../../events/domain/entities/partner.entity';
import { IPartnerRepository } from '../../../domain/repositories/partner-repository.interface';
import { EntityManager } from '@mikro-orm/mysql';
import { PartnerSchema } from '../schemas';

export class PartnerMysqlRepository implements IPartnerRepository {
  constructor(private readonly em: EntityManager) {}

  async add(entity: Partner): Promise<void> {
    let schema = await this.em.findOne(PartnerSchema, { id: entity.id.value });
    if (schema) {
      schema.name = entity.name;
    } else {
      schema = PartnerSchema.fromDomain(entity);
      this.em.persist(schema);
    }
  }

  async findById(id: string | PartnerId): Promise<Partner | null> {
    const schema = await this.em.findOne(PartnerSchema, {
      id: typeof id === 'string' ? id : id.value,
    });
    return schema ? schema.toDomain() : null;
  }

  async findAll(): Promise<Partner[]> {
    const schemas = await this.em.find(PartnerSchema, {});
    return schemas.map((schema) => schema.toDomain());
  }

  async delete(entity: Partner): Promise<void> {
    const schema = await this.em.findOne(PartnerSchema, {
      id: entity.id.value,
    });
    if (schema) {
      await this.em.removeAndFlush(schema);
    }
  }
}
