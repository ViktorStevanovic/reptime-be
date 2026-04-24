import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
  ValidateNested,
  IsDateString,
  IsInt,
  Min,
} from 'class-validator';

export class CreateTrainerProfileDto {
  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  specialization?: string;
}

export class CreateClientProfileDto {
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  height?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  weight?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsNotEmpty()
  trainerId!: string;
}

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  surname!: string;

  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @MinLength(8)
  password!: string;

  @IsUUID()
  roleId!: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateTrainerProfileDto)
  trainerProfile?: CreateTrainerProfileDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateClientProfileDto)
  clientProfile?: CreateClientProfileDto;
}
