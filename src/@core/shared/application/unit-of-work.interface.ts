export interface IUnitOfWork {
  beginTransaction(): Promise<void>;
  completeTransaction(): Promise<void>;
  runTransaction<T>(callback: () => Promise<T>): Promise<T>;
  rollbackTransaction(): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
}
