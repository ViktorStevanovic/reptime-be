import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/decorators/legacy';
import { Trainer } from '../trainers/trainer.entity';
import { Client } from '../clients/client.entity';
import { AvailabilitySlot } from '../availability-slots/availability-slot.entity';

@Entity({ tableName: 'appointments' })
export class Appointment {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  id!: string;

  @ManyToOne(() => Trainer)
  trainer!: Trainer;

  @ManyToOne(() => Client)
  client!: Client;

  @ManyToOne(() => AvailabilitySlot)
  slot!: AvailabilitySlot;

  @Property({ default: 'scheduled' })
  status!: string;

  @Property({ defaultRaw: 'now()' })
  createdAt!: Date;

  @Property({ defaultRaw: 'now()', onUpdate: () => new Date() })
  updatedAt!: Date;
}
