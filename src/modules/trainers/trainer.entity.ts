import { defineEntity, p } from '@mikro-orm/core';
import { User } from '../users/user.entity';

const TrainerSchema = defineEntity({
  name: 'Trainer',
  tableName: 'trainers',
  properties: {
    id: p.uuid().primary().defaultRaw('gen_random_uuid()'),
    user: p.oneToOne(User),
    createdBy: p.manyToOne(User),
    bio: p.text().nullable(),
    specialization: p.string().nullable(),
    slotGenerationDays: p.smallint().default(21),
    createdAt: p.datetime().defaultRaw('now()'),
    updatedAt: p
      .datetime()
      .defaultRaw('now()')
      .onUpdate(() => new Date()),
  },
});
export class Trainer extends TrainerSchema.class {}
TrainerSchema.setClass(Trainer);
