import { Event, EventId } from '../../../domain/entities/event.entity';
import { EntityManager } from '@mikro-orm/mysql';
import { IEventRepository } from '../../../../events/domain/repositories/event-repository.interface';
import { EventSchema } from '../schemas';

export class EventMysqlRepository implements IEventRepository {
  constructor(private readonly em: EntityManager) {}

  async add(entity: Event): Promise<void> {
    let schema = await this.em.findOne(EventSchema, { id: entity.id.value });
    if (schema) {
      schema.name = entity.name;
    } else {
      schema = EventSchema.fromDomain(entity);
      this.em.persist(schema);
    }
    await this.em.flush();
  }

  async findById(id: string | EventId): Promise<Event | null> {
    const schema = await this.em.findOne(EventSchema, {
      id: typeof id === 'string' ? id : id.value,
    });
    return schema ? schema.toDomain() : null;
  }

  async findAll(): Promise<Event[]> {
    const schemas = await this.em.find(EventSchema, {});
    return schemas.map((schema) => schema.toDomain());
  }

  async delete(entity: Event): Promise<void> {
    const schema = await this.em.findOne(EventSchema, { id: entity.id.value });
    if (schema) {
      await this.em.removeAndFlush(schema);
    }
  }
}
