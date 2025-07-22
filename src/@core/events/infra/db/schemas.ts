import {
  Entity,
  PrimaryKey,
  Property,
  OneToMany,
  ManyToOne,
  Collection,
  Cascade,
  EntitySchema,
} from '@mikro-orm/core';

import { EventSection } from '../../domain/entities/event-section';
import { EventSpot, EventSpotId } from '../../domain/entities/event-spot';
import { Partner, PartnerId } from '../../domain/entities/partner.entity';
import { Event } from '../../domain/entities/event.entity';
import { Cpf } from '../../../shared/domain/value-objects/cpf.vo';
import { Customer, CustomerId } from '../../domain/entities/customer.entity';

// Partner entity
@Entity()
export class PartnerSchema {
  @PrimaryKey({ type: 'uuid' })
  id!: string;

  @Property()
  name!: string;

  static fromDomain(partner: Partner): PartnerSchema {
    const schema = new PartnerSchema();
    schema.id = partner.id.value;
    schema.name = partner.name;
    return schema;
  }

  toDomain(): Partner {
    return new Partner({
      id: new PartnerId(this.id),
      name: this.name,
    });
  }
}

// Customer entity
@Entity()
export class CustomerSchema {
  @PrimaryKey({ type: 'uuid' })
  id!: string;

  @Property({ type: 'string' })
  cpf!: string;

  @Property({ length: 255 })
  name!: string;

  static fromDomain(customer: Customer): CustomerSchema {
    const schema = new CustomerSchema();
    schema.id = customer.id!.toString() ?? '';
    schema.cpf = customer.cpf.value;
    schema.name = customer.name;
    return schema;
  }

  toDomain(): Customer {
    return new Customer({
      id: this.id ? new CustomerId(this.id) : undefined,
      cpf: new Cpf(this.cpf),
      name: this.name,
    });
  }
}

// Event entity
@Entity()
export class EventSchema {
  @PrimaryKey({ type: 'uuid' })
  id!: string;

  @Property({ length: 255 })
  name!: string;

  @Property({ type: 'text', nullable: true })
  description?: string;

  @Property({ type: 'date' })
  date!: Date;

  @Property({ default: false })
  is_published: boolean = false;

  @Property({ default: 0 })
  total_spots: number = 0;

  @Property({ default: 0 })
  total_spots_reserved: number = 0;

  // Relação ManyToOne com Partner
  @ManyToOne(() => PartnerSchema)
  partner!: string;

  // Relação OneToMany com EventSection
  @OneToMany(() => EventSectionSchema, (section) => section.event, {
    cascade: [Cascade.ALL],
    eager: true,
    mappedBy: 'event',
  })
  sections = new Collection<EventSectionSchema>(this);

  static fromDomain(event: Event): EventSchema {
    const schema = new EventSchema();
    schema.id = event.id.value;
    schema.name = event.name;
    schema.description = event.description ?? '';
    schema.date = event.date;
    schema.is_published = event.is_published;
    schema.total_spots = event.total_spots;
    schema.total_spots_reserved = event.total_spots_reserved;
    schema.partner = event.partner_id.value;

    schema.sections = new Collection<EventSectionSchema>(
      schema,
      event.sections?.map((section) => {
        const secSchema = EventSectionSchema.fromDomain(section);
        secSchema.event = schema.id;
        return secSchema;
      }) ?? [],
    );
    return schema;
  }

  toDomain(): Event {
    return new Event({
      id: new EventSpotId(this.id),
      name: this.name,
      description: this.description ?? '',
      date: this.date,
      is_published: this.is_published,
      total_spots: this.total_spots,
      total_spots_reserved: this.total_spots_reserved,
      partner_id: this.partner,

      // sections: this.sections.getItems().map((section) => section),
    });
  }
}

// EventSection entity
@Entity()
export class EventSectionSchema {
  @PrimaryKey({ type: 'uuid' })
  id!: string;

  @Property({ length: 255 })
  name!: string;

  @Property({ type: 'text', nullable: true })
  description?: string;

  @Property({ default: false })
  is_published: boolean = false;

  @Property({ default: 0 })
  total_spots: number = 0;

  @Property({ default: 0 })
  total_spots_reserved: number = 0;

  @Property({ default: 0 })
  price: number = 0;

  // Relação ManyToOne com Event
  @ManyToOne(() => EventSchema)
  event!: string;

  // Relação OneToMany com EventSpot
  @OneToMany(() => EventSpotSchema, (spot) => spot.event_section, {
    cascade: [Cascade.ALL],
    eager: true,
    mappedBy: 'event_section',
  })
  spots = new Collection<EventSpotSchema>(this);

  static fromDomain(section: EventSection): EventSectionSchema {
    const schema = new EventSectionSchema();
    schema.id = section.id.value;
    schema.name = section.name;
    schema.description = section.description ?? '';
    schema.is_published = section.is_published;
    schema.total_spots = section.total_spots;
    schema.total_spots_reserved = section.total_spots_reserved;
    schema.price = section.price;
    schema.event = section.event_id!.toString() ?? '';

    schema.spots = new Collection<EventSpotSchema>(
      schema,
      section.spots?.map(EventSpotSchema.fromDomain) ?? [],
    );
    return schema;
  }

  toDomain(): EventSection {
    return new EventSection({
      id: this.id,
      name: this.name,
      description: this.description,
      is_published: this.is_published,
      total_spots: this.total_spots,
      total_spots_reserved: this.total_spots_reserved,
      price: this.price,
      event_id: this.event,

      // spots: this.spots.getItems().map((spot) => spot.toDomain()),
    });
  }
}

// EventSpot entity
@Entity()
export class EventSpotSchema {
  @PrimaryKey({ type: 'uuid' })
  id!: string;

  @Property({ length: 255, nullable: true })
  location?: string;

  @Property({ default: false })
  is_reserved: boolean = false;

  @Property({ default: false })
  is_published: boolean = false;

  // Relação ManyToOne com EventSection
  @ManyToOne(() => EventSectionSchema)
  event_section!: string;

  static fromDomain(spot: EventSpot): EventSpotSchema {
    const schema = new EventSpotSchema();
    schema.id = spot.id.value;
    schema.location = spot.location ?? '';
    schema.is_reserved = spot.is_reserved ?? false;
    schema.is_published = spot.is_published;
    schema.event_section = spot.event_section_id.toString() ?? '';
    return schema;
  }

  toDomain(): EventSpot {
    return new EventSpot({
      id: new EventSpotId(this.id),
      location: this.location || '',
      is_reserved: this.is_reserved,
      is_published: this.is_published,
      event_section_id: this.event_section,
    });
  }
}

// SpotReservationSchema entity
@Entity()
export class SpotReservationSchema {
  @PrimaryKey({ type: 'uuid' })
  id!: string;

  @Property({ length: 255, nullable: true })
  location?: string;

  @Property({ default: false })
  is_reserved: boolean = false;

  @Property({ default: false })
  is_published: boolean = false;

  // Relação ManyToOne com EventSection
  @ManyToOne(() => EventSectionSchema)
  event_section!: string;

  static fromDomain(spot: EventSpot): EventSpotSchema {
    const schema = new EventSpotSchema();
    schema.id = spot.id.value;
    schema.location = spot.location ?? '';
    schema.is_reserved = spot.is_reserved ?? false;
    schema.is_published = spot.is_published;
    schema.event_section = spot.event_section_id.toString() ?? '';
    return schema;
  }

  toDomain(): EventSpot {
    return new EventSpot({
      id: new EventSpotId(this.id),
      location: this.location || '',
      is_reserved: this.is_reserved,
      is_published: this.is_published,
      event_section_id: this.event_section,
    });
  }
}
