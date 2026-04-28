import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class BookAppointmentDto {
  @IsUUID()
  @IsNotEmpty()
  slotId!: string;

  @IsOptional()
  @IsUUID()
  clientId?: string;
}
