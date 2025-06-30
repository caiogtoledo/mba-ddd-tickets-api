import { Cascade, EntitySchema } from '@mikro-orm/core';
import { Partner } from '../../domain/entities/partner.entity';
import { PartnerIdSchemaType } from './types/partner-id.schema-type';
import { Customer } from '../../domain/entities/customer.entity';
import { CustomerIdSchemaType } from './types/customer-id.schema-type';
import { CpfSchemaType } from './types/cpf.schema-type';
import { EventIdSchemaType } from './types/event-id.schema-type';
import { EventSection } from '../../domain/entities/event-section';
import { EventSectionIdSchemaType } from './types/event-section-id.schema-type';
import { EventSpot } from '../../domain/entities/event-spot';
import { EventSpotIdSchemaType } from './types/event-spot-id.schema-type';
import { Event } from '../../domain/entities/event.entity';

export const PartnerSchema = new EntitySchema<Partner>({
  class: Partner,
  properties: {
    id: { primary: true, type: PartnerIdSchemaType },
    name: { type: 'string', length: 255 },
  },
});

export const CustomerSchema = new EntitySchema<Customer>({
  class: Customer,
  uniques: [{ properties: ['cpf'] }],
  properties: {
    id: {
      type: CustomerIdSchemaType,
      primary: true,
    },
    cpf: { type: CpfSchemaType },
    name: { type: 'string', length: 255 },
  },
});

export const EventSchema = new EntitySchema<Event>({
  class: Event,
  properties: {
    id: {
      type: EventIdSchemaType,
      primary: true,
    },
    name: { type: 'string', length: 255 },
    description: { type: 'text', nullable: true },
    date: { type: 'date' },
    is_published: { type: 'boolean', default: false },
    total_spots: { type: 'number', default: 0 },
    total_spots_reserved: { type: 'number', default: 0 },
    sections: {
      //   reference: '1:m',
      entity: () => EventSection,
      mappedBy: (section) => section[0].event_id,
      eager: true,
      cascade: [Cascade.ALL],
    },
    partner_id: {
      //   reference: 'm:1',
      entity: () => Partner,
      mapToPk: true,
      type: PartnerIdSchemaType,
    },
  },
});

export const EventSectionSchema = new EntitySchema<EventSection>({
  class: EventSection,
  properties: {
    id: {
      type: EventSectionIdSchemaType,
      primary: true,
    },
    name: { type: 'string', length: 255 },
    description: { type: 'text', nullable: true },
    is_published: { type: 'boolean', default: false },
    total_spots: { type: 'number', default: 0 },
    total_spots_reserved: { type: 'number', default: 0 },
    price: { type: 'number', default: 0 },
    spots: {
      //   reference: '1:m',
      entity: () => EventSpot,
      mappedBy: (section) => section[0].event_section_id,
      eager: true,
      cascade: [Cascade.ALL],
    },
    // event: {
    //   reference: 'm:1',
    //   entity: () => Event,
    //   hidden: true,
    //   customType: new EventIdSchemaType(),
    // },
  },
});

export const EventSpotSchema = new EntitySchema<EventSpot>({
  class: EventSpot,
  properties: {
    id: {
      type: EventSpotIdSchemaType,
      primary: true,
    },
    location: { type: 'string', length: 255, nullable: true },
    is_reserved: { type: 'boolean', default: false },
    is_published: { type: 'boolean', default: false },
    // event_section_id: {
    //   reference: 'm:1',
    //   entity: () => EventSection,
    //   hidden: true,
    //   mapToPk: true,
    //   customType: new EventSectionIdSchemaType(),
    // },
  },
});
