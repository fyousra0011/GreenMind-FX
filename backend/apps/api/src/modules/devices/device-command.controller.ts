import {
  Body,
  Controller,
  ForbiddenException,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Idempotent } from '../../common/idempotency/idempotency.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { DeviceCommandDto } from './dto/device-command.dto';
import { DeviceCommandService } from './device-command.service';

@Controller('tenants/:tenantId/sites/:siteId/devices')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class DeviceCommandController {
  constructor(private readonly deviceCommandService: DeviceCommandService) {}

  @Post(':deviceId/command')
  @Idempotent()
  async publish(
    @Param('tenantId') tenantId: string,
    @Param('siteId') siteId: string,
    @Param('deviceId') deviceId: string,
    @Body() dto: DeviceCommandDto,
    @Req() req: any,
  ) {
    const userTenantId = req.user?.tenantId;
    const userSiteId = req.user?.siteId;

    if (tenantId !== userTenantId || siteId !== userSiteId) {
      throw new ForbiddenException('JWT tenant/site mismatch');
    }

    const commandDto = {
      ...dto,
      deviceId,
    };

    return this.deviceCommandService.publishCommand(commandDto, {
      tenantId: userTenantId,
      siteId: userSiteId,
      userId: req.user?.id,
      email: req.user?.email,
    });
  }
}
