import { defineEntity, p } from '@mikro-orm/core';
import { Trainer } from '../trainers/trainer.entity';
import { Client } from '../clients/client.entity';
import { AvailabilitySlot } from '../availability-slots/availability-slot.entity';

const AppointmentSchema = defineEntity({
  name: 'Appointment',
  tableName: 'appointments',
  properties: {
    id: p.uuid().primary().defaultRaw('gen_random_uuid()'),
    trainer: p.manyToOne(Trainer),
    client: p.manyToOne(Client),
    slot: p.manyToOne(AvailabilitySlot),
    status: p.string().default('scheduled'),
    createdAt: p.datetime().defaultRaw('now()'),
    updatedAt: p
      .datetime()
      .defaultRaw('now()')
      .onUpdate(() => new Date()),
  },
});

export class Appointment extends AppointmentSchema.class {}
AppointmentSchema.setClass(Appointment);
