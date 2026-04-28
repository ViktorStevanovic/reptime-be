import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { TrainersModule } from './modules/trainers/trainers.module';
import mikroOrmConfig from './mikro-orm.config';
import { UserRolesModule } from './modules/user-roles/user-roles.module';
import { ClientsModule } from './modules/clients/clients.module';
import { ScheduleTemplatesModule } from './modules/schedule-templates/schedule-templates.module';
import { AvailabilitySlotsModule } from './modules/availability-slots/availability-slots.module';

@Module({
  imports: [
    MikroOrmModule.forRoot(mikroOrmConfig),
    ScheduleModule.forRoot(),
    UsersModule,
    AuthModule,
    UserRolesModule,
    TrainersModule,
    ClientsModule,
    ScheduleTemplatesModule,
    AvailabilitySlotsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
