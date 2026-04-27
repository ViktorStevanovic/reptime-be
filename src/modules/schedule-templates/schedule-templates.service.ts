import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { ScheduleTemplate } from './schedule-template.entity';
import { Trainer } from '../trainers/trainer.entity';
import { CreateScheduleTemplateDto } from './dto/create-schedule-template.dto';
import { UpdateScheduleTemplateDto } from './dto/update-schedule-template.dto';

@Injectable()
export class ScheduleTemplatesService {
  constructor(
    @InjectRepository(ScheduleTemplate)
    private readonly scheduleTemplateRepository: EntityRepository<ScheduleTemplate>,
    private readonly em: EntityManager,
  ) {}

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private validateBlockTime(
    startTime: string,
    endTime: string,
    blockTime: number,
  ): void {
    const totalMinutes =
      this.timeToMinutes(endTime) - this.timeToMinutes(startTime);
    if (totalMinutes <= 0) {
      throw new BadRequestException('endTime must be after startTime');
    }
    if (totalMinutes % blockTime !== 0) {
      throw new BadRequestException(
        `Time range (${totalMinutes} min) is not evenly divisible by block time (${blockTime} min)`,
      );
    }
  }

  private async validateNoOverlap(
    trainerId: string,
    weekDay: number,
    startTime: string,
    endTime: string,
    excludeId?: string,
  ): Promise<void> {
    const existing = await this.scheduleTemplateRepository.find({
      trainer: trainerId,
      weekDay,
      active: true,
    });

    const newStart = this.timeToMinutes(startTime);
    const newEnd = this.timeToMinutes(endTime);

    for (const template of existing) {
      if (excludeId && template.id === excludeId) {
        continue;
      }
      const existStart = this.timeToMinutes(template.startTime);
      const existEnd = this.timeToMinutes(template.endTime);

      if (newStart < existEnd && existStart < newEnd) {
        throw new ConflictException(
          `Time range ${startTime}–${endTime} overlaps with existing template ${template.startTime}–${template.endTime}`,
        );
      }
    }
  }

  async findAll(trainerId: string): Promise<ScheduleTemplate[]> {
    return this.scheduleTemplateRepository.find({ trainer: trainerId });
  }

  async findOne(id: string, trainerId: string): Promise<ScheduleTemplate> {
    const template = await this.scheduleTemplateRepository.findOne({
      id,
      trainer: trainerId,
    });
    if (!template) {
      throw new NotFoundException('Schedule template not found');
    }
    return template;
  }

  async create(
    dto: CreateScheduleTemplateDto,
    trainerId: string,
  ): Promise<ScheduleTemplate> {
    this.validateBlockTime(dto.startTime, dto.endTime, dto.blockTime);
    await this.validateNoOverlap(
      trainerId,
      dto.weekDay,
      dto.startTime,
      dto.endTime,
    );

    const trainer = await this.em.findOneOrFail(Trainer, { id: trainerId });

    const template = this.em.create(ScheduleTemplate, {
      trainer,
      weekDay: dto.weekDay,
      startTime: dto.startTime,
      endTime: dto.endTime,
      blockTime: dto.blockTime,
    });

    await this.em.flush();
    return template;
  }

  async update(
    id: string,
    dto: UpdateScheduleTemplateDto,
    trainerId: string,
  ): Promise<ScheduleTemplate> {
    const template = await this.scheduleTemplateRepository.findOne({
      id,
      trainer: trainerId,
    });
    if (!template) {
      throw new NotFoundException('Schedule template not found');
    }

    const startTime = dto.startTime ?? template.startTime;
    const endTime = dto.endTime ?? template.endTime;
    const blockTime = dto.blockTime ?? template.blockTime;
    const weekDay = dto.weekDay ?? template.weekDay;
    this.validateBlockTime(startTime, endTime, blockTime);
    await this.validateNoOverlap(trainerId, weekDay, startTime, endTime, id);

    this.em.assign(template, dto);
    await this.em.flush();
    return template;
  }

  async remove(id: string, trainerId: string): Promise<void> {
    const template = await this.scheduleTemplateRepository.findOne({
      id,
      trainer: trainerId,
    });
    if (!template) {
      throw new NotFoundException('Schedule template not found');
    }

    this.em.assign(template, { active: false });
    await this.em.flush();
  }

  async activate(id: string, trainerId: string): Promise<void> {
    const template = await this.scheduleTemplateRepository.findOne({
      id,
      trainer: trainerId,
    });
    if (!template) {
      throw new NotFoundException('Schedule template not found');
    }

    this.em.assign(template, { active: true });
    await this.em.flush();
  }
}
