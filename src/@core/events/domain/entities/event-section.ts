import {
  AnyCollection,
  ICollection,
  MyCollectionFactory,
} from '../../../shared/domain/my-collection';
import { Entity } from '../../../shared/domain/entity';
import Uuid from '../../../shared/domain/value-objects/uuid.vo';
import { EventSpot } from './event-spot';
import { EventId } from './event.entity';

export class EventSectionId extends Uuid {}

export type EventSectionCreateCommand = {
  name: string;
  description?: string | null;
  total_spots: number;
  price: number;
};

export type EventSectionConstructorProps = {
  id?: EventSectionId | string;
  name: string;
  description?: string | null;
  is_published?: boolean;
  total_spots: number;
  total_spots_reserved: number;
  price: number;
  event_id?: EventId | string;
};

export class EventSection extends Entity<EventSectionConstructorProps> {
  id: EventSectionId;
  name: string;
  description: string | null;
  is_published: boolean;
  total_spots: number;
  total_spots_reserved: number;
  price: number;
  event_id?: EventId | string;
  private _spots?: ICollection<EventSpot>;

  constructor(props: EventSectionConstructorProps) {
    super();
    this.id =
      typeof props.id === 'string'
        ? new EventSectionId(props.id)
        : (props.id ?? new EventSectionId());
    this.name = props.name;
    this.description = props.description ?? null;
    this.is_published = props.is_published ?? false;
    this.total_spots = props.total_spots;
    this.total_spots_reserved = props.total_spots_reserved ?? 0;
    this.price = props.price;
    this.event_id =
      props.event_id instanceof EventId
        ? props.event_id
        : new EventId(props.event_id);
    this._spots = MyCollectionFactory.create<EventSpot>(this);
  }

  static create(command: EventSectionCreateCommand) {
    const section = new EventSection({
      ...command,
      description: command.description ?? null,
      is_published: false,
      total_spots_reserved: 0,
    });

    section.initSpots();

    return section;
  }

  private initSpots() {
    for (let i = 0; i < this.total_spots; i++) {
      this.spots.add(EventSpot.create(this.id));
    }
  }

  changeName(name: string) {
    this.name = name;
  }

  changeDescription(description: string | null) {
    this.description = description;
  }

  changePrice(price: number) {
    this.price = price;
  }

  publish() {
    this.is_published = true;
  }

  unPublish() {
    this.is_published = false;
  }

  publishAll() {
    this.publish();
    this.spots?.forEach((spot) => spot.publish());
  }

  unPublishAll() {
    this.unPublish();
    this.spots?.forEach((spot) => spot.unPublish());
  }

  get spots(): ICollection<EventSpot> {
    return this._spots as ICollection<EventSpot>;
  }

  set spots(spots: AnyCollection<EventSpot>) {
    this._spots = MyCollectionFactory.create<EventSpot>(spots);
  }

  toJSON() {
    return {
      id: this.id.value,
      name: this.name,
      description: this.description,
      is_published: this.is_published,
      total_spots: this.total_spots,
      total_spots_reserved: this.total_spots_reserved,
      price: this.price,
      spots: this.spots
        ? Array.from(this.spots).map((spot) => spot.toJSON())
        : [],
    };
  }
}
