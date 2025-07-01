import { Entity } from '../../../shared/domain/entity';
import Uuid from '../../../shared/domain/value-objects/uuid.vo';
import { EventSectionId } from './event-section';

export class EventSpotId extends Uuid {}

export type EventSpotConstructorProps = {
  id?: EventSpotId;
  location: string | null;
  is_reserved?: boolean;
  is_published: boolean;
  event_section_id: EventSectionId | string;
};

export class EventSpot extends Entity<EventSpotConstructorProps> {
  id: EventSpotId;
  location: string | null;
  is_reserved?: boolean;
  is_published: boolean;
  event_section_id: EventSectionId | string;

  constructor(props: EventSpotConstructorProps) {
    super();
    this.id =
      typeof props.id === 'string'
        ? new EventSpotId(props.id)
        : (props.id ?? new EventSpotId());
    this.location = props.location;
    this.is_reserved = props.is_reserved;
    this.is_published = props.is_published;

    this.event_section_id =
      props.event_section_id instanceof EventSectionId
        ? props.event_section_id
        : new EventSectionId(props.event_section_id);
  }

  static create(event_section_id: EventSectionId | string) {
    return new EventSpot({
      location: null,
      is_published: false,
      is_reserved: false,
      event_section_id,
    });
  }

  changeLocation(location: string | null) {
    this.location = location;
  }

  publish() {
    this.is_published = true;
  }

  unPublish() {
    this.is_published = false;
  }

  toJSON() {
    return {
      id: this.id.value,
      location: this.location,
      is_reserved: this.is_reserved,
      is_published: this.is_published,
    };
  }
}
