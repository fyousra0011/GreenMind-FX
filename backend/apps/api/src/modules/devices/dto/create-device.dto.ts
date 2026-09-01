import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';

export enum DeviceType {
  CONTROLLER = 'controller',
  SENSOR = 'sensor',
  GATEWAY = 'gateway',
}

export class CreateDeviceDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  name!: string;

  @IsEnum(DeviceType)
  type!: DeviceType;

  @IsOptional()
  @IsNumber()
  @Min(0)
  battery?: number;

  @IsString()
  @IsNotEmpty()
  status!: string;
}
