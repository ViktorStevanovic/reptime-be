import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UsersController } from './users.controller';
import { Trainer } from '../trainers/trainer.entity';
import { Client } from '../clients/client.entity';

@Module({
  imports: [MikroOrmModule.forFeature([User, Trainer, Client])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
