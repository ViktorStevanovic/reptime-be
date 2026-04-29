import {
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/decorators/legacy';
import { Trainer } from '../trainers/trainer.entity';

@Entity({ tableName: 'availability_slots' })
export class AvailabilitySlot {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  id!: string;

  @ManyToOne(() => Trainer)
  trainer!: Trainer;

  @Property({ type: 'date' })
  date!: string; // "2025-04-22"

  @Property()
  startTime!: string; // "09:00"

  @Property()
  endTime!: string; // "10:00"

  @Property({ default: true })
  active!: boolean;

  @Property({ default: false })
  booked!: boolean;

  @Property({ defaultRaw: 'now()' })
  createdAt!: Date;

  @Property({ defaultRaw: 'now()', onUpdate: () => new Date() })
  updatedAt!: Date;
}
