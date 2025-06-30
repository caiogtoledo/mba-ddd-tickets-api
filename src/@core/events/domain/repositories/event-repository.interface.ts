import { IRepository } from '../../../shared/domain/repository-interface';
import { Event } from '../entities/event.entity';

export interface EventRepositoryInterface extends IRepository<Event> {}
