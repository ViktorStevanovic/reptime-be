import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { ScheduleTemplatesService } from './schedule-templates.service';
import { LoggedUser } from '../../common/decorators/logged-user.decorator';
import type { LoggedUserPayload } from '../../common/decorators/logged-user.decorator';
import { CreateScheduleTemplateDto } from './dto/create-schedule-template.dto';
import { UpdateScheduleTemplateDto } from './dto/update-schedule-template.dto';
import { ScheduleTemplate } from './schedule-template.entity';

@Controller('schedule-templates')
@Roles(Role.TRAINER)
export class ScheduleTemplatesController {
  constructor(
    private readonly scheduleTemplatesService: ScheduleTemplatesService,
  ) {}

  @Get()
  async list(
    @LoggedUser() user: LoggedUserPayload,
  ): Promise<ScheduleTemplate[]> {
    return this.scheduleTemplatesService.findAll(user.trainerId as string);
  }

  @Get(':id')
  async detail(
    @Param('id') id: string,
    @LoggedUser() user: LoggedUserPayload,
  ): Promise<ScheduleTemplate> {
    return this.scheduleTemplatesService.findOne(id, user.trainerId as string);
  }

  @Post()
  async create(
    @Body() dto: CreateScheduleTemplateDto,
    @LoggedUser() user: LoggedUserPayload,
  ): Promise<ScheduleTemplate> {
    return this.scheduleTemplatesService.create(dto, user.trainerId as string);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateScheduleTemplateDto,
    @LoggedUser() user: LoggedUserPayload,
  ): Promise<ScheduleTemplate> {
    return this.scheduleTemplatesService.update(
      id,
      dto,
      user.trainerId as string,
    );
  }

  @Patch(':id/activate')
  async activate(
    @Param('id') id: string,
    @LoggedUser() user: LoggedUserPayload,
  ): Promise<{ message: string }> {
    // only if no active template exists for the same weekDay
    await this.scheduleTemplatesService.activate(id, user.trainerId as string);
    return { message: 'Schedule template activated successfully' };
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @LoggedUser() user: LoggedUserPayload,
  ): Promise<{ message: string }> {
    await this.scheduleTemplatesService.remove(id, user.trainerId as string);
    return { message: 'Schedule template deactivated successfully' };
  }
}
