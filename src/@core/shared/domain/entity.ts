export abstract class Entity<T> {
  readonly _id: any;
  abstract toJSON(): any;

  equals(obj: this): boolean {
    if (obj === null || obj === undefined) {
      return false;
    }

    if (obj._id === undefined) {
      return false;
    }

    if (obj.constructor.name !== this.constructor.name) {
      return false;
    }

    return obj._id.equals(this._id);
  }
}
