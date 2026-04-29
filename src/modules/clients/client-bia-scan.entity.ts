import { defineEntity, p } from '@mikro-orm/core';
import { Client } from './client.entity';
import { Trainer } from '../trainers/trainer.entity';
import { Appointment } from '../appointments/appointment.entity';

const ClientBiaScanSchema = defineEntity({
  name: 'ClientBiaScan',
  tableName: 'client_bia_scans',
  properties: {
    id: p.uuid().primary().defaultRaw('gen_random_uuid()'),
    client: () => p.manyToOne(Client),
    trainer: p.manyToOne(Trainer),
    appointment: () => p.manyToOne(Appointment).nullable(),
    measuredAt: p.datetime(),
    weight: p.integer(), // grams
    bodyFatPercentage: p.double().nullable(),
    muscleMass: p.integer().nullable(), // grams
    notes: p.text().nullable(),
    createdAt: p.datetime().defaultRaw('now()'),
  },
});

export class ClientBiaScan extends ClientBiaScanSchema.class {}
ClientBiaScanSchema.setClass(ClientBiaScan);
