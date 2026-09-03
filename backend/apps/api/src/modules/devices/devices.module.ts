import { Module } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { DevicesController } from './devices.controller';
import { DeviceCommandController } from './device-command.controller';
import { DeviceCommandService } from './device-command.service';

@Module({
  controllers: [DevicesController, DeviceCommandController],
  providers: [DevicesService, DeviceCommandService],
  exports: [DevicesService, DeviceCommandService],
})
export class DevicesModule {}
