import { defineEntity, p } from '@mikro-orm/core';
import { Trainer } from '../trainers/trainer.entity';

const AvailabilityOverrideSchema = defineEntity({
  name: 'AvailabilityOverride',
  tableName: 'availability_overrides',
  properties: {
    id: p.uuid().primary().defaultRaw('gen_random_uuid()'),
    trainer: p.manyToOne(Trainer),
    startDate: p.date(),
    endDate: p.date(),
    fullDay: p.boolean().default(false),
    startTime: p.string().nullable(),
    endTime: p.string().nullable(),
    reason: p.text().nullable(),
    createdAt: p.datetime().defaultRaw('now()'),
    updatedAt: p
      .datetime()
      .defaultRaw('now()')
      .onUpdate(() => new Date()),
  },
});

export class AvailabilityOverride extends AvailabilityOverrideSchema.class {}
AvailabilityOverrideSchema.setClass(AvailabilityOverride);
