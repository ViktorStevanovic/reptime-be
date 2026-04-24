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
    phoneNumber: p.string().nullable(),
    dateOfBirth: p.date().nullable(),
    height: p.smallint().nullable(), //cm
    weight: p.smallint().nullable(), //grams
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
