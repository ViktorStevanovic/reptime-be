import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Appointment } from './appointment.entity';
import { AvailabilitySlot } from '../availability-slots/availability-slot.entity';
import { Client } from '../clients/client.entity';
import { Trainer } from '../trainers/trainer.entity';
import { AppointmentStatus } from '../../common/enums/appointment-status.enum';
import { BookAppointmentDto } from './dto/book-appointment.dto';
import type { LoggedUserPayload } from '../../common/decorators/logged-user.decorator';
import { Role } from '../../common/enums/role.enum';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: EntityRepository<Appointment>,
    private readonly em: EntityManager,
  ) {}

  async findAll(user: LoggedUserPayload): Promise<Appointment[]> {
    if (user.role.toString() === Role.TRAINER.toString()) {
      return this.appointmentRepository.find(
        { trainer: user.trainerId },
        {
          populate: ['client', 'slot'],
          orderBy: { slot: { date: 'asc', startTime: 'asc' } },
        },
      );
    }
    return this.appointmentRepository.find(
      { client: user.clientId },
      {
        populate: ['trainer', 'slot'],
        orderBy: { slot: { date: 'asc', startTime: 'asc' } },
      },
    );
  }

  async book(
    dto: BookAppointmentDto,
    user: LoggedUserPayload,
  ): Promise<Appointment> {
    const slot = await this.em.findOne(
      AvailabilitySlot,
      { id: dto.slotId, active: true },
      { populate: ['trainer'] },
    );
    if (!slot) {
      throw new NotFoundException('Availability slot not found');
    }
    if (slot.booked) {
      throw new ConflictException('This slot is already booked');
    }

    let client: Client | null;
    let trainer: Trainer;

    if (user.role.toString() === Role.TRAINER.toString()) {
      if (!dto.clientId) {
        throw new BadRequestException(
          'clientId is required when booking as a trainer',
        );
      }
      trainer = await this.em.findOneOrFail(Trainer, { id: user.trainerId });
      client = await this.em.findOne(Client, {
        id: dto.clientId,
        trainer: trainer.id,
      });
      if (!client) {
        throw new NotFoundException('Client not found');
      }
    } else {
      client = await this.em.findOneOrFail(Client, { id: user.clientId });
      trainer = slot.trainer;
      if (client.trainer.id !== trainer.id) {
        throw new BadRequestException(
          'This slot does not belong to your trainer',
        );
      }
    }

    slot.booked = true;

    const appointment = this.em.create(Appointment, {
      trainer,
      client,
      slot,
      status: AppointmentStatus.SCHEDULED,
    });

    await this.em.flush();
    return appointment;
  }

  async cancel(id: string, user: LoggedUserPayload): Promise<Appointment> {
    const where: Record<string, unknown> = { id };
    if (user.role.toString() === Role.TRAINER.toString()) {
      where.trainer = user.trainerId;
    } else {
      where.client = user.clientId;
    }

    const appointment = await this.appointmentRepository.findOne(where, {
      populate: ['slot'],
    });
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }
    if (
      appointment.status.toString() !== AppointmentStatus.SCHEDULED.toString()
    ) {
      throw new BadRequestException(
        'Only scheduled appointments can be canceled',
      );
    }

    appointment.status = AppointmentStatus.CANCELED;
    appointment.slot.booked = false;

    await this.em.flush();
    return appointment;
  }
}
