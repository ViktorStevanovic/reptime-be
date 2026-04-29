import { Collection } from '@mikro-orm/core';
import {
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/decorators/legacy';
import { User } from '../users/user.entity';
import { Trainer } from '../trainers/trainer.entity';
import { ClientBiaScan } from './client-bia-scan.entity';
import { Appointment } from '../appointments/appointment.entity';

@Entity({ tableName: 'clients' })
export class Client {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  id!: string;

  @OneToOne(() => User)
  user!: User;

  @ManyToOne(() => Trainer)
  trainer!: Trainer;

  @ManyToOne(() => User)
  createdBy!: User;

  @Property({ type: 'date', nullable: true })
  dateOfBirth?: string;

  @Property({ nullable: true })
  gender?: string;

  @Property({ type: 'smallint', nullable: true })
  heightCm?: number;

  @Property({ nullable: true })
  goal?: string;

  @Property({ type: 'text', nullable: true })
  notes?: string;

  @OneToMany(() => ClientBiaScan, (scan) => scan.client)
  biaScans = new Collection<ClientBiaScan>(this);

  @OneToMany(() => Appointment, (appt) => appt.client)
  appointments = new Collection<Appointment>(this);

  @Property({ defaultRaw: 'now()' })
  createdAt!: Date;

  @Property({ defaultRaw: 'now()', onUpdate: () => new Date() })
  updatedAt!: Date;
}
