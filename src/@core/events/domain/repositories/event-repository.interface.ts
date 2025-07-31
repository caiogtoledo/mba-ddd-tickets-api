import { IRepository } from '../../../shared/domain/repository-interface';
import { Event } from '../entities/event.entity';

export interface IEventRepository extends IRepository<Event> {}
