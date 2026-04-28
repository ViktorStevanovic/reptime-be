import { ConflictException, Injectable } from '@nestjs/common';
import { Client } from './client.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { CreateClientDto } from './dto/create-client.dto';
import { User } from '../users/user.entity';
import { UserRole } from '../user-roles/user-role.entity';
import { Trainer } from '../trainers/trainer.entity';
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
      phoneNumber: dto.phoneNumber ?? null,
      dateOfBirth: dto.dateOfBirth ?? null,
      height: dto.height ?? null,
      weight: dto.weight ?? null,
      notes: dto.notes ?? null,
    });

    await this.em.flush();
    return client;
  }
}
