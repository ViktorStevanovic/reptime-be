import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/decorators/legacy';
import { Client } from './client.entity';
import { Trainer } from '../trainers/trainer.entity';
import { Appointment } from '../appointments/appointment.entity';

@Entity({ tableName: 'client_bia_scans' })
export class ClientBiaScan {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  id!: string;

  @ManyToOne(() => Client)
  client!: Client;

  @ManyToOne(() => Trainer)
  trainer!: Trainer;

  @ManyToOne(() => Appointment, { nullable: true })
  appointment?: Appointment;

  @Property()
  measuredAt!: Date;

  @Property({ type: 'integer' })
  weight!: number; // grams

  @Property({ type: 'double', nullable: true })
  bodyFatPercentage?: number;

  @Property({ type: 'integer', nullable: true })
  muscleMass?: number; // grams

  @Property({ type: 'text', nullable: true })
  notes?: string;

  @Property({ defaultRaw: 'now()' })
  createdAt!: Date;
}
