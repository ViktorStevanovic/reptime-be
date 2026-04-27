import { defineEntity, p } from '@mikro-orm/core';
import { Trainer } from '../trainers/trainer.entity';

const ScheduleTemplateSchema = defineEntity({
  name: 'ScheduleTemplate',
  tableName: 'schedule_templates',
  properties: {
    id: p.uuid().primary().defaultRaw('gen_random_uuid()'),
    trainer: p.manyToOne(Trainer),
    weekDay: p.smallint(), // 1 = Monday, 2 = Tuesday, ..., 7 = Sunday
    startTime: p.string(), // "08:30" (time-only, in 24h format)
    endTime: p.string(), // "12:30"
    blockTime: p.smallint(), // Slot duration in minutes (e.g., 60)
    active: p.boolean().default(true),
    createdAt: p.datetime().defaultRaw('now()'),
    updatedAt: p
      .datetime()
      .defaultRaw('now()')
      .onUpdate(() => new Date()),
  },
});

export class ScheduleTemplate extends ScheduleTemplateSchema.class {}
ScheduleTemplateSchema.setClass(ScheduleTemplate);
