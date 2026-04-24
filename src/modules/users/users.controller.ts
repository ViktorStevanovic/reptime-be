import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
@Roles(Role.ADMIN)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async listUsers(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @Get(':id')
  async detailUser(@Param('id') id: string): Promise<User> {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Post()
  async createUser(
    @Body() dto: CreateUserDto,
    @Request() req: Request & { user: { sub: string } },
  ) {
    const createdBy = await this.usersService.findById(req.user.sub);
    if (!createdBy) {
      throw new NotFoundException('Authenticated user not found');
    }
    return this.usersService.create(dto, createdBy);
  }
}
