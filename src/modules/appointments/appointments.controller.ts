import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { LoggedUser } from '../../common/decorators/logged-user.decorator';
import type { LoggedUserPayload } from '../../common/decorators/logged-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { Appointment } from './appointment.entity';
import { BookAppointmentDto } from './dto/book-appointment.dto';

@Controller('appointments')
@Roles(Role.TRAINER, Role.CLIENT)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get()
  async list(@LoggedUser() user: LoggedUserPayload): Promise<Appointment[]> {
    return this.appointmentsService.findAll(user);
  }

  @Post()
  async book(
    @Body() dto: BookAppointmentDto,
    @LoggedUser() user: LoggedUserPayload,
  ): Promise<Appointment> {
    return this.appointmentsService.book(dto, user);
  }

  @Patch(':id/cancel')
  async cancel(
    @Param('id') id: string,
    @LoggedUser() user: LoggedUserPayload,
  ): Promise<Appointment> {
    return this.appointmentsService.cancel(id, user);
  }
}
