import { Body, Controller, Get, Post } from '@nestjs/common';

import { ClientsService } from './clients.service';
import { Role } from '../../common/enums/role.enum';
import { Roles } from '../../common/decorators/roles.decorator';
import { LoggedUser } from '../../common/decorators/logged-user.decorator';
import type { LoggedUserPayload } from '../../common/decorators/logged-user.decorator';
import { Client } from './client.entity';
import { CreateClientDto } from './dto/create-client.dto';

@Controller('clients')
@Roles(Role.TRAINER)
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  async list(@LoggedUser() user: LoggedUserPayload): Promise<Client[]> {
    return this.clientsService.findAll(user.trainerId as string);
  }

  @Post()
  async create(
    @Body() dto: CreateClientDto,
    @LoggedUser() user: LoggedUserPayload,
  ): Promise<Client> {
    return this.clientsService.create(dto, user.trainerId as string);
  }
}
