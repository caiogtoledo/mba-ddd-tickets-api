import {
  Partner,
  PartnerId,
} from '../../../../events/domain/entities/partner.entity';
import { PartnerRepositoryInterface } from '../../../domain/repositories/partner-repository.interface';
import { EntityManager } from '@mikro-orm/mysql';

export class PartnerMysqlRepository implements PartnerRepositoryInterface {
  constructor(private readonly em: EntityManager) {}

  async add(entity: Partner): Promise<void> {
    this.em.persist(entity);
  }

  async findById(id: string | PartnerId): Promise<Partner | null> {
    return this.em.findOne(Partner, {
      id: typeof id === 'string' ? new PartnerId(id) : id,
    });
  }

  async findAll(): Promise<Partner[]> {
    return this.em.find(Partner, {});
  }

  async delete(entity: Partner): Promise<void> {
    this.em.remove(entity);
  }
}
