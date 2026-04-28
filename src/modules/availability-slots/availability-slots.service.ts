import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  EntityManager,
  EntityRepository,
  FilterQuery,
} from '@mikro-orm/postgresql';
import { AvailabilitySlot } from './availability-slot.entity';
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
    const where: FilterQuery<AvailabilitySlot> = {
      trainer: trainerId,
      active: true,
    };
    if (date) {
      where.date = date;
    }
    return this.slotRepository.find(where, {
      orderBy: { date: 'asc', startTime: 'asc' },
    });
  }
}
