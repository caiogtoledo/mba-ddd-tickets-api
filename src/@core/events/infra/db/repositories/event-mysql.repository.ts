import { Event, EventId } from '../../../domain/entities/event.entity';
import { EntityManager } from '@mikro-orm/mysql';
import { EventRepositoryInterface } from '../../../../events/domain/repositories/event-repository.interface';

export class EventMysqlRepository implements EventRepositoryInterface {
  constructor(private readonly em: EntityManager) {}

  async add(entity: Event): Promise<void> {
    this.em.persist(entity);
  }

  async findById(id: string | EventId): Promise<Event | null> {
    return this.em.findOne(Event, {
      id: typeof id === 'string' ? new EventId(id) : id,
    });
  }

  async findAll(): Promise<Event[]> {
    return this.em.find(Event, {});
  }

  async delete(entity: Event): Promise<void> {
    this.em.remove(entity);
  }
}
