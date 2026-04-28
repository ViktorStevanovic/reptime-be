import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  EntityManager,
  EntityRepository,
  FilterQuery,
} from '@mikro-orm/postgresql';
import { AvailabilityOverride } from './availability-override.entity';
import { AvailabilitySlot } from '../availability-slots/availability-slot.entity';
import { Trainer } from '../trainers/trainer.entity';
import { CreateAvailabilityOverrideDto } from './dto/create-availability-override.dto';

@Injectable()
export class AvailabilityOverridesService {
  constructor(
    @InjectRepository(AvailabilityOverride)
    private readonly overrideRepository: EntityRepository<AvailabilityOverride>,
    private readonly em: EntityManager,
  ) {}

  async findAll(trainerId: string): Promise<AvailabilityOverride[]> {
    return this.overrideRepository.find(
      { trainer: trainerId },
      { orderBy: { startDate: 'asc' } },
    );
  }

  async create(
    dto: CreateAvailabilityOverrideDto,
    trainerId: string,
  ): Promise<AvailabilityOverride> {
    if (dto.startDate > dto.endDate) {
      throw new BadRequestException(
        'startDate must be less than or equal to endDate',
      );
    }

    if (!dto.fullDay && dto.startTime! >= dto.endTime!) {
      throw new BadRequestException('startTime must be before endTime');
    }

    const trainer = await this.em.findOneOrFail(Trainer, { id: trainerId });

    const slotWhere: FilterQuery<AvailabilitySlot> = {
      trainer: trainerId,
      booked: true,
      date: { $gte: dto.startDate, $lte: dto.endDate },
    };

    if (!dto.fullDay) {
      slotWhere.startTime = { $gte: dto.startTime!, $lt: dto.endTime! };
    }

    const bookedSlots = await this.em.find(AvailabilitySlot, slotWhere);
    if (bookedSlots.length > 0) {
      const bookedDetails = bookedSlots
        .map((s) => `${s.date} ${s.startTime}-${s.endTime}`)
        .join(', ');
      throw new ConflictException(
        `Cannot create override: the following slots are already booked: ${bookedDetails}. Please reschedule them first.`,
      );
    }

    const override = this.em.create(AvailabilityOverride, {
      trainer,
      startDate: dto.startDate,
      endDate: dto.endDate,
      fullDay: dto.fullDay,
      startTime: dto.fullDay ? null : dto.startTime!,
      endTime: dto.fullDay ? null : dto.endTime!,
      reason: dto.reason ?? null,
    });

    await this.em.flush();
    return override;
  }

  async remove(id: string, trainerId: string): Promise<void> {
    const override = await this.overrideRepository.findOne({
      id,
      trainer: trainerId,
    });
    if (!override) {
      throw new NotFoundException('Availability override not found');
    }

    this.em.remove(override);
    await this.em.flush();
  }
}
