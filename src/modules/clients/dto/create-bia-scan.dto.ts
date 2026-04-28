import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CircumferenceDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  chestCm?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  waistCm?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  hipsCm?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  leftArmCm?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  rightArmCm?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  leftThighCm?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  rightThighCm?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  leftCalfCm?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  rightCalfCm?: number;
}

export class CreateBiaScanDto {
  @IsUUID()
  @IsNotEmpty()
  clientId!: string;

  @IsOptional()
  @IsUUID()
  appointmentId?: string;

  @IsDateString()
  @IsNotEmpty()
  measuredAt!: string;

  @IsInt()
  @Min(0)
  weight!: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  bodyFatPercentage?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  muscleMass?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CircumferenceDto)
  circumferences?: CircumferenceDto;
}
