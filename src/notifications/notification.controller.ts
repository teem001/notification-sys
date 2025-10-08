import { Controller, Get, Param, Query } from '@nestjs/common';
import { NotificationsService } from './notification.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('user/:userId')
  async getUserNotifications(
    @Param('userId') userId: string,
    @Query('perPage') perPage = '10',
    @Query('page') page = '1',
  ) {
    const params = {
      perPage: Number(perPage),
      page: Number(page),
    };
    return this.notificationsService.getUserNotifications(userId, params);
  }
  @Get()
  async getRecipientNotifications(
    @Query('recipient') recipient: string,
    @Query('page') page = 1,
    @Query('perPage') perPage = 20,
  ) {
    if (!recipient) {
      return {
        success: false,
        message: 'Recipient (email, phone, or device token) is required',
      };
    }

    const notifications = await this.notificationsService.getUserNotifications(
      recipient,
      {
        perPage: Number(perPage),
        page: Number(page),
      },
    );

    return {
      success: true,
      message: 'Notifications retrieved successfully',
      ...notifications,
    };
  }
}
