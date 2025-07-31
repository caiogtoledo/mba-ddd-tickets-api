import { AggregateRoot } from './aggregate-root';

export interface IRepository<E extends AggregateRoot<any>> {
  add(entity: E): Promise<void>;
  findById(id: string): Promise<E | null>;
  findAll(): Promise<E[]>;
  delete(entity: E): Promise<void>;
}
