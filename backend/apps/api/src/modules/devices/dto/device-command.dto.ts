import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

// Design constraint: every MQTT action in this enum is an explicit state-set command
// (for example, irrigation_on means "set irrigation to ON"), not a toggle/inverse command.
// Because MQTT QoS 1 is at-least-once delivery, duplicate identical commands are expected to
// be safe and idempotent. New actions must preserve this property; a toggle-style action would
// break the semantics if the same message is delivered twice.
export enum DeviceCommandAction {
  IRRIGATION_ON = 'irrigation_on',
  IRRIGATION_OFF = 'irrigation_off',
  LIGHTS_ON = 'lights_on',
  LIGHTS_OFF = 'lights_off',
  COOLING_ON = 'cooling_on',
  COOLING_OFF = 'cooling_off',
  ALERT_ON = 'alert_on',
  ALERT_OFF = 'alert_off',
}

export class DeviceCommandDto {
  @IsString()
  @IsNotEmpty()
  deviceId!: string;

  @IsEnum(DeviceCommandAction)
  action!: DeviceCommandAction;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(86400)
  durationSeconds?: number;
}
