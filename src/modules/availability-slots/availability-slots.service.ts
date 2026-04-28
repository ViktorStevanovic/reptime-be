import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  EntityManager,
  EntityRepository,
  FilterQuery,
} from '@mikro-orm/postgresql';
import { AvailabilitySlot } from './availability-slot.entity';
import { AvailabilityOverride } from '../availability-overrides/availability-override.entity';
import { Client } from '../clients/client.entity';
import type { LoggedUserPayload } from '../../common/decorators/logged-user.decorator';

@Injectable()
export class AvailabilitySlotsService {
  constructor(
    @InjectRepository(AvailabilitySlot)
    private readonly slotRepository: EntityRepository<AvailabilitySlot>,
    private readonly em: EntityManager,
  ) {}

  private async resolveTrainerId(user: LoggedUserPayload): Promise<string> {
    if (user.trainerId) {
      return user.trainerId;
    }
    const client = await this.em.findOne(
      Client,
      { id: user.clientId },
      { populate: ['trainer'] },
    );
    if (!client) {
      throw new NotFoundException('Client profile not found');
    }
    return client.trainer.id;
  }

  async findAll(
    user: LoggedUserPayload,
    date?: string,
  ): Promise<AvailabilitySlot[]> {
    const trainerId = await this.resolveTrainerId(user);
    const now = new Date();
    const today = now.toISOString().slice(0, 10);
    const currentTime =
      now.getHours().toString().padStart(2, '0') +
      ':' +
      now.getMinutes().toString().padStart(2, '0');

    const where: FilterQuery<AvailabilitySlot> = {
      trainer: trainerId,
      active: true,
      date: date && date >= today ? date : { $gte: today },
      $or: [
        { date: { $gt: today } },
        { date: today, startTime: { $gte: currentTime } },
      ],
    };

    const slots = await this.slotRepository.find(where, {
      orderBy: { date: 'asc', startTime: 'asc' },
    });

    const overrides = await this.em.find(AvailabilityOverride, {
      trainer: trainerId,
      startDate: { $lte: date ?? slots.at(-1)?.date ?? today },
      endDate: { $gte: date ?? today },
    });

    if (overrides.length === 0) {
      return slots;
    }

    return slots.filter((slot) => !this.isOverridden(slot, overrides));
  }

  private isOverridden(
    slot: AvailabilitySlot,
    overrides: AvailabilityOverride[],
  ): boolean {
    const slotDate = String(slot.date);
    return overrides.some((o) => {
      if (slotDate < String(o.startDate) || slotDate > String(o.endDate)) {
        return false;
      }
      if (o.fullDay) {
        return true;
      }
      return slot.startTime >= o.startTime! && slot.startTime < o.endTime!;
    });
  }
}
