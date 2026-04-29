import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/decorators/legacy';
import { Trainer } from '../trainers/trainer.entity';

@Entity({ tableName: 'availability_overrides' })
export class AvailabilityOverride {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  id!: string;

  @ManyToOne(() => Trainer)
  trainer!: Trainer;

  @Property({ type: 'date' })
  startDate!: string;

  @Property({ type: 'date' })
  endDate!: string;

  @Property({ default: false })
  fullDay!: boolean;

  @Property({ nullable: true })
  startTime?: string;

  @Property({ nullable: true })
  endTime?: string;

  @Property({ type: 'text', nullable: true })
  reason?: string;

  @Property({ defaultRaw: 'now()' })
  createdAt!: Date;

  @Property({ defaultRaw: 'now()', onUpdate: () => new Date() })
  updatedAt!: Date;
}
