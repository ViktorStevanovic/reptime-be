import { Entity, OneToOne, PrimaryKey, Property } from '@mikro-orm/decorators/legacy';
import { ClientBiaScan } from './client-bia-scan.entity';

@Entity({ tableName: 'client_bia_circumferences' })
export class ClientBiaCircumference {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  id!: string;

  @OneToOne(() => ClientBiaScan)
  biaScan!: ClientBiaScan;

  @Property({ type: 'double', nullable: true })
  chestCm?: number;

  @Property({ type: 'double', nullable: true })
  waistCm?: number;

  @Property({ type: 'double', nullable: true })
  hipsCm?: number;

  @Property({ type: 'double', nullable: true })
  leftArmCm?: number;

  @Property({ type: 'double', nullable: true })
  rightArmCm?: number;

  @Property({ type: 'double', nullable: true })
  leftThighCm?: number;

  @Property({ type: 'double', nullable: true })
  rightThighCm?: number;

  @Property({ type: 'double', nullable: true })
  leftCalfCm?: number;

  @Property({ type: 'double', nullable: true })
  rightCalfCm?: number;
}
