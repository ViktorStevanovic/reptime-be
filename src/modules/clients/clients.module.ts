import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Client } from './client.entity';
import { ClientBiaScan } from './client-bia-scan.entity';
import { ClientBiaCircumference } from './client-bia-circumference.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([Client, ClientBiaScan, ClientBiaCircumference]),
  ],
  providers: [ClientsService],
  controllers: [ClientsController],
})
export class ClientsModule {}
