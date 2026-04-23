import { Controller, Get } from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { UserRolesService } from './user-roles.service';
import { UserRole } from './user-role.entity';

@Controller('user-roles')
@Roles(Role.ADMIN)
export class UserRolesController {
  constructor(private userRolesService: UserRolesService) {}

  @Get()
  findAll(): Promise<UserRole[]> {
    return this.userRolesService.findAll();
  }
}
