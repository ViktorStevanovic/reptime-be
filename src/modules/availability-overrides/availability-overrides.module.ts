import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AvailabilityOverridesController } from './availability-overrides.controller';
import { AvailabilityOverridesService } from './availability-overrides.service';
import { AvailabilityOverride } from './availability-override.entity';

@Module({
  imports: [MikroOrmModule.forFeature([AvailabilityOverride])],
  controllers: [AvailabilityOverridesController],
  providers: [AvailabilityOverridesService],
})
export class AvailabilityOverridesModule {}
