import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  NotFoundException,
} from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { Observable } from 'rxjs';
import { Trainer } from '../../modules/trainers/trainer.entity';
import { Client } from '../../modules/clients/client.entity';
import { Role } from '../enums/role.enum';
import type { LoggedUserPayload } from '../decorators/logged-user.decorator';

@Injectable()
export class ResolveUserInterceptor implements NestInterceptor {
  constructor(private readonly em: EntityManager) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<unknown>> {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request['user'] as LoggedUserPayload | undefined;

    if (!user) {
      return next.handle();
    }

    if (user.role.toString() === Role.TRAINER.toString()) {
      const trainer = await this.em.findOne(Trainer, { user: user.sub });
      if (!trainer) {
        throw new NotFoundException('Trainer profile not found');
      }
      user.trainerId = trainer.id;
    } else if (user.role.toString() === Role.CLIENT.toString()) {
      const client = await this.em.findOne(Client, { user: user.sub });
      if (!client) {
        throw new NotFoundException('Client profile not found');
      }
      user.clientId = client.id;
    }

    return next.handle();
  }
}
