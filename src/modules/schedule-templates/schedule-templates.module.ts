import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ScheduleTemplatesController } from './schedule-templates.controller';
import { ScheduleTemplatesService } from './schedule-templates.service';
import { ScheduleTemplate } from './schedule-template.entity';
import { Trainer } from '../trainers/trainer.entity';

@Module({
  imports: [MikroOrmModule.forFeature([ScheduleTemplate, Trainer])],
  controllers: [ScheduleTemplatesController],
  providers: [ScheduleTemplatesService],
})
export class ScheduleTemplatesModule {}
