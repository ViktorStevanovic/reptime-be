import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Client } from './client.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { CreateClientDto } from './dto/create-client.dto';
import { CreateBiaScanDto } from './dto/create-bia-scan.dto';
import { User } from '../users/user.entity';
import { UserRole } from '../user-roles/user-role.entity';
import { Trainer } from '../trainers/trainer.entity';
import { Appointment } from '../appointments/appointment.entity';
import { ClientBiaScan } from './client-bia-scan.entity';
import { ClientBiaCircumference } from './client-bia-circumference.entity';
import { Role } from '../../common/enums/role.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: EntityRepository<Client>,
    private readonly em: EntityManager,
  ) {}

  async findAll(trainerId: string): Promise<Client[]> {
    return this.clientRepository.find({ trainer: trainerId });
  }

  async create(dto: CreateClientDto, trainerId: string): Promise<Client> {
    const existingUser = await this.em.findOne(User, { email: dto.email });
    if (existingUser) {
      throw new ConflictException('A user with this email already exists');
    }

    const role = await this.em.findOneOrFail(UserRole, { code: Role.CLIENT });
    const trainer = await this.em.findOneOrFail(Trainer, { id: trainerId });
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = this.em.create(User, {
      name: dto.name,
      surname: dto.surname,
      email: dto.email,
      password: hashedPassword,
      role,
    });

    const client = this.em.create(Client, {
      user,
      trainer,
      createdBy: trainer.user,
      dateOfBirth: dto.dateOfBirth ?? null,
      gender: dto.gender ?? null,
      heightCm: dto.heightCm ?? null,
      goal: dto.goal ?? null,
      notes: dto.notes ?? null,
    });

    await this.em.flush();
    return client;
  }

  async findBiaScans(
    clientId: string,
    trainerId: string,
  ): Promise<ClientBiaScan[]> {
    const client = await this.clientRepository.findOne({
      id: clientId,
      trainer: trainerId,
    });
    if (!client) {
      throw new NotFoundException('Client not found');
    }
    return this.em.find(
      ClientBiaScan,
      { client: clientId },
      {
        populate: ['appointment'],
        orderBy: { measuredAt: 'desc' },
      },
    );
  }

  async createBiaScan(
    dto: CreateBiaScanDto,
    trainerId: string,
  ): Promise<ClientBiaScan> {
    const client = await this.clientRepository.findOne({
      id: dto.clientId,
      trainer: trainerId,
    });
    if (!client) {
      throw new NotFoundException('Client not found');
    }

    const trainer = await this.em.findOneOrFail(Trainer, { id: trainerId });

    let appointment: Appointment | null = null;
    if (dto.appointmentId) {
      appointment = await this.em.findOne(Appointment, {
        id: dto.appointmentId,
        trainer: trainerId,
        client: dto.clientId,
      });
      if (!appointment) {
        throw new NotFoundException('Appointment not found');
      }
    }

    const biaScan = this.em.create(ClientBiaScan, {
      client,
      trainer,
      appointment,
      measuredAt: new Date(dto.measuredAt),
      weight: dto.weight,
      bodyFatPercentage: dto.bodyFatPercentage ?? null,
      muscleMass: dto.muscleMass ?? null,
      notes: dto.notes ?? null,
    });

    if (dto.circumferences) {
      this.em.create(ClientBiaCircumference, {
        biaScan,
        chestCm: dto.circumferences.chestCm ?? null,
        waistCm: dto.circumferences.waistCm ?? null,
        hipsCm: dto.circumferences.hipsCm ?? null,
        leftArmCm: dto.circumferences.leftArmCm ?? null,
        rightArmCm: dto.circumferences.rightArmCm ?? null,
        leftThighCm: dto.circumferences.leftThighCm ?? null,
        rightThighCm: dto.circumferences.rightThighCm ?? null,
        leftCalfCm: dto.circumferences.leftCalfCm ?? null,
        rightCalfCm: dto.circumferences.rightCalfCm ?? null,
      });
    }

    await this.em.flush();
    return biaScan;
  }
}
