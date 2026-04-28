import { defineEntity, p } from '@mikro-orm/core';
import { User } from '../users/user.entity';
import { Trainer } from '../trainers/trainer.entity';

const ClientSchema = defineEntity({
  name: 'Client',
  tableName: 'clients',
  properties: {
    id: p.uuid().primary().defaultRaw('gen_random_uuid()'),
    user: p.oneToOne(User),
    trainer: p.manyToOne(Trainer),
    createdBy: p.manyToOne(User),
    dateOfBirth: p.date().nullable(),
    gender: p.string().nullable(),
    heightCm: p.smallint().nullable(),
    goal: p.string().nullable(),
    notes: p.text().nullable(),
    createdAt: p.datetime().defaultRaw('now()'),
    updatedAt: p
      .datetime()
      .defaultRaw('now()')
      .onUpdate(() => new Date()),
  },
});
export class Client extends ClientSchema.class {}
ClientSchema.setClass(Client);
