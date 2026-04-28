import { Controller, Get, Post, Query } from '@nestjs/common';
import { AvailabilitySlotsService } from './availability-slots.service';
import { AvailabilitySlotsGeneratorService } from './availability-slots-generator.service';
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
    private readonly availabilitySlotsGeneratorService: AvailabilitySlotsGeneratorService,
  ) {}

  @Get()
  async list(
    @LoggedUser() user: LoggedUserPayload,
    @Query('date') date?: string,
  ): Promise<AvailabilitySlot[]> {
    return this.availabilitySlotsService.findAll(user, date);
  }

  @Post('generate')
  @Roles(Role.TRAINER)
  async generate(): Promise<{ message: string }> {
    await this.availabilitySlotsGeneratorService.generate();
    return { message: 'Slots generated' };
  }
}
