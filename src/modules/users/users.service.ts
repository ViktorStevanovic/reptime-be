import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    private readonly em: EntityManager,
  ) {}

  findOne(email: string): Promise<User | null> {
    return this.userRepository.findOne({ email: email });
  }

  findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ id });
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
