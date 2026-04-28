import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AvailabilitySlotsController } from './availability-slots.controller';
import { AvailabilitySlotsService } from './availability-slots.service';
import { AvailabilitySlotsGeneratorService } from './availability-slots-generator.service';
import { AvailabilitySlot } from './availability-slot.entity';

@Module({
  imports: [MikroOrmModule.forFeature([AvailabilitySlot])],
  controllers: [AvailabilitySlotsController],
  providers: [AvailabilitySlotsService, AvailabilitySlotsGeneratorService],
  exports: [AvailabilitySlotsService],
})
export class AvailabilitySlotsModule {}
