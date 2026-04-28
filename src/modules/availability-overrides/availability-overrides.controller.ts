import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { AvailabilityOverridesService } from './availability-overrides.service';
import { LoggedUser } from '../../common/decorators/logged-user.decorator';
import type { LoggedUserPayload } from '../../common/decorators/logged-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { AvailabilityOverride } from './availability-override.entity';
import { CreateAvailabilityOverrideDto } from './dto/create-availability-override.dto';

@Controller('availability-overrides')
@Roles(Role.TRAINER)
export class AvailabilityOverridesController {
  constructor(
    private readonly availabilityOverridesService: AvailabilityOverridesService,
  ) {}

  @Get()
  async list(
    @LoggedUser() user: LoggedUserPayload,
  ): Promise<AvailabilityOverride[]> {
    return this.availabilityOverridesService.findAll(user.trainerId as string);
  }

  @Post()
  async create(
    @Body() dto: CreateAvailabilityOverrideDto,
    @LoggedUser() user: LoggedUserPayload,
  ): Promise<AvailabilityOverride> {
    return this.availabilityOverridesService.create(
      dto,
      user.trainerId as string,
    );
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @LoggedUser() user: LoggedUserPayload,
  ): Promise<{ message: string }> {
    await this.availabilityOverridesService.remove(
      id,
      user.trainerId as string,
    );
    return { message: 'Availability override removed' };
  }
}
