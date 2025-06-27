import { Partner } from '../../domain/entities/partner.entity';

import { EntitySchema } from '@mikro-orm/core';
import { PartnerIdSchemaType } from './types/partner-id.schema-type';

export const PartnerSchema = new EntitySchema<Partner>({
  class: Partner,
  properties: {
    id: { type: PartnerIdSchemaType, primary: true },
    name: { type: String, length: 255 },
  },
});
