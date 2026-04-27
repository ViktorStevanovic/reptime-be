import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from '../../common/enums/role.enum';
import { UserRole } from '../user-roles/user-role.entity';
import { Trainer } from '../trainers/trainer.entity';
import { Client } from '../clients/client.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    private readonly em: EntityManager,
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepository.findAll({ populate: ['role'] });
  }

  findOne(email: string): Promise<User | null> {
    return this.userRepository.findOne({ email }, { populate: ['role'] });
  }

  findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ id }, { populate: ['role'] });
  }

  async create(dto: CreateUserDto, createdBy: User): Promise<User> {
    const role = await this.em.findOneOrFail(UserRole, { id: dto.roleId });

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = this.em.create(User, {
      name: dto.name,
      surname: dto.surname,
      email: dto.email,
      password: hashedPassword,
      role,
    });

    if (role.code.toString() === Role.TRAINER.toString()) {
      if (!dto.trainerProfile) {
        throw new BadRequestException(
          'trainerProfile is required for trainer role',
        );
      }
      this.em.create(Trainer, {
        user,
        createdBy,
        bio: dto.trainerProfile.bio ?? null,
        specialization: dto.trainerProfile.specialization ?? null,
      });
    }

    if (role.code.toString() === Role.CLIENT.toString()) {
      if (!dto.clientProfile) {
        throw new BadRequestException(
          'clientProfile is required for client role',
        );
      }
      const trainer = await this.em.findOneOrFail(Trainer, {
        id: dto.clientProfile.trainerId,
      });
      this.em.create(Client, {
        user,
        trainer,
        createdBy,
        phoneNumber: dto.clientProfile.phoneNumber ?? null,
        dateOfBirth: dto.clientProfile.dateOfBirth ?? null,
        height: dto.clientProfile.height ?? null,
        weight: dto.clientProfile.weight ?? null,
        notes: dto.clientProfile.notes ?? null,
      });
    }

    await this.em.flush();
    return user;
  }

  async updateRefreshToken(
    userId: string,
    hashedRefreshToken: string | null,
  ): Promise<void> {
    const user = await this.userRepository.findOneOrFail({ id: userId });
    user.hashedRefreshToken = hashedRefreshToken;
    await this.em.flush();
  }
}
