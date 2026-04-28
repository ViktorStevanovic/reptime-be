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
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  heightCm?: number;

  @IsOptional()
  @IsString()
  goal?: string;

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

  @IsOptional()
  @IsString()
  phoneNumber?: string;

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
