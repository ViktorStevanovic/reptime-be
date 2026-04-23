import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { TrainersModule } from './modules/trainers/trainers.module';
import mikroOrmConfig from './mikro-orm.config';
import { UserRolesModule } from './modules/user-roles/user-roles.module';

@Module({
  imports: [
    MikroOrmModule.forRoot(mikroOrmConfig),
    UsersModule,
    AuthModule,
    UserRolesModule,
    TrainersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
