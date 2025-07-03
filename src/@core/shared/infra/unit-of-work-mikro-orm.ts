import { EntityManager } from '@mikro-orm/mysql';
import { IUnitOfWork } from '../application/unit-of-work.interface';

export class UnitOfWorkMikroOrm implements IUnitOfWork {
  constructor(private readonly em: EntityManager) {}

  async commit(): Promise<void> {
    await this.em.flush();
  }

  async rollback(): Promise<void> {
    this.em.clear();
  }
}
