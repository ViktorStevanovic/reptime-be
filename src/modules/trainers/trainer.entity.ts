import {
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/decorators/legacy';
import { User } from '../users/user.entity';

@Entity({ tableName: 'trainers' })
export class Trainer {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  id!: string;

  @OneToOne(() => User)
  user!: User;

  @ManyToOne(() => User)
  createdBy!: User;

  @Property({ type: 'text', nullable: true })
  bio?: string;

  @Property({ nullable: true })
  specialization?: string;

  @Property({ type: 'smallint', default: 21 })
  slotGenerationDays!: number;

  @Property({ defaultRaw: 'now()' })
  createdAt!: Date;

  @Property({ defaultRaw: 'now()', onUpdate: () => new Date() })
  updatedAt!: Date;
}
