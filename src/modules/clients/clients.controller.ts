import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { ClientsService } from './clients.service';
import { Role } from '../../common/enums/role.enum';
import { Roles } from '../../common/decorators/roles.decorator';
import { LoggedUser } from '../../common/decorators/logged-user.decorator';
import type { LoggedUserPayload } from '../../common/decorators/logged-user.decorator';
import { Client } from './client.entity';
import { ClientBiaScan } from './client-bia-scan.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { CreateBiaScanDto } from './dto/create-bia-scan.dto';

@Controller('clients')
@Roles(Role.TRAINER)
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  async list(@LoggedUser() user: LoggedUserPayload): Promise<Client[]> {
    return this.clientsService.findAll(user.trainerId as string);
  }

  @Get(':id')
  async detail(
    @Param('id') id: string,
    @LoggedUser() user: LoggedUserPayload,
  ): Promise<Client> {
    return this.clientsService.findOne(id, user.trainerId as string);
  }

  @Post()
  async create(
    @Body() dto: CreateClientDto,
    @LoggedUser() user: LoggedUserPayload,
  ): Promise<Client> {
    return this.clientsService.create(dto, user.trainerId as string);
  }

  @Get(':clientId/bia-scans')
  async listBiaScans(
    @Param('clientId') clientId: string,
    @LoggedUser() user: LoggedUserPayload,
  ): Promise<ClientBiaScan[]> {
    return this.clientsService.findBiaScans(clientId, user.trainerId as string);
  }

  @Post(':clientId/bia-scans')
  async createBiaScan(
    @Param('clientId') clientId: string,
    @Body() dto: CreateBiaScanDto,
    @LoggedUser() user: LoggedUserPayload,
  ): Promise<ClientBiaScan> {
    dto.clientId = clientId;
    return this.clientsService.createBiaScan(dto, user.trainerId as string);
  }
}
