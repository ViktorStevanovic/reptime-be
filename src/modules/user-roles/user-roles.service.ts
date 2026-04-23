import { Injectable } from '@nestjs/common';
import { UserRole } from './user-role.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Role } from '../../common/enums/role.enum';

@Injectable()
export class UserRolesService {
  constructor(
    @InjectRepository(UserRole)
    private readonly userRoleRepository: EntityRepository<UserRole>,
  ) {}

  async findAll(): Promise<UserRole[]> {
    return this.userRoleRepository.findAll();
  }

  async findByCode(code: Role): Promise<UserRole | null> {
    return this.userRoleRepository.findOne({ code });
  }

  /**
   * Returns the enum values directly — useful when you don't
   * need the DB entity, just the list of possible roles.
   */
  getAvailableRoles(): { key: string; value: string }[] {
    return Object.entries(Role).map(([key, value]) => ({ key, value }));
  }
}
