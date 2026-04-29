import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/decorators/legacy';
import { Trainer } from '../trainers/trainer.entity';

@Entity({ tableName: 'schedule_templates' })
export class ScheduleTemplate {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  id!: string;

  @ManyToOne(() => Trainer)
  trainer!: Trainer;

  @Property({ type: 'smallint' })
  weekDay!: number; // 1 = Monday, 2 = Tuesday, ..., 7 = Sunday

  @Property()
  startTime!: string; // "08:30" (time-only, in 24h format)

  @Property()
  endTime!: string; // "12:30"

  @Property({ type: 'smallint' })
  blockTime!: number; // Slot duration in minutes (e.g., 60)

  @Property({ default: true })
  active!: boolean;

  @Property({ defaultRaw: 'now()' })
  createdAt!: Date;

  @Property({ defaultRaw: 'now()', onUpdate: () => new Date() })
  updatedAt!: Date;
}
