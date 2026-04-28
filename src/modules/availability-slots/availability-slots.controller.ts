import { Controller, Get, Query } from '@nestjs/common';
import { AvailabilitySlotsService } from './availability-slots.service';
import { LoggedUser } from '../../common/decorators/logged-user.decorator';
import type { LoggedUserPayload } from '../../common/decorators/logged-user.decorator';
import { AvailabilitySlot } from './availability-slot.entity';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';

@Controller('availability-slots')
@Roles(Role.TRAINER, Role.CLIENT)
export class AvailabilitySlotsController {
  constructor(
    private readonly availabilitySlotsService: AvailabilitySlotsService,
  ) {}

  @Get()
  async list(
    @LoggedUser() user: LoggedUserPayload,
    @Query('date') date?: string,
  ): Promise<AvailabilitySlot[]> {
    return this.availabilitySlotsService.findAll(user, date);
  }
}
