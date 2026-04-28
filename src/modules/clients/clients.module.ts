import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Client } from './client.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Client])],
  providers: [ClientsService],
  controllers: [ClientsController],
})
export class ClientsModule {}
