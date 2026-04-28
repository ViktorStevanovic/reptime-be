import { defineEntity, p } from '@mikro-orm/core';
import { Trainer } from '../trainers/trainer.entity';

const AvailabilitySlotSchema = defineEntity({
  name: 'AvailabilitySlot',
  tableName: 'availability_slots',
  properties: {
    id: p.uuid().primary().defaultRaw('gen_random_uuid()'),
    trainer: p.manyToOne(Trainer),
    date: p.date(), // "2025-04-22"
    startTime: p.string(), // "09:00"
    endTime: p.string(), // "10:00"
    active: p.boolean().default(true),
    booked: p.boolean().default(false),
    createdAt: p.datetime().defaultRaw('now()'),
    updatedAt: p
      .datetime()
      .defaultRaw('now()')
      .onUpdate(() => new Date()),
  },
});

export class AvailabilitySlot extends AvailabilitySlotSchema.class {}
AvailabilitySlotSchema.setClass(AvailabilitySlot);
