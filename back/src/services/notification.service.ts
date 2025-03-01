import { CreateNotificationDto } from '@/dtos/notifications.dto';
import { Notification } from '@/interfaces/notification.interface';
import { socketInstance } from '@/server';
import { PrismaClient } from '@prisma/client';
import { Service } from 'typedi';

@Service()
export class NotificationService {
  public notification = new PrismaClient().notification;

  public async createNotification(senderId: string, receiverId: string, notificationData: CreateNotificationDto): Promise<Notification> {
    const notification = await this.notification.create({
      data: { ...notificationData, receiverId: receiverId, senderId: senderId },
    });

    socketInstance.to(receiverId).emit('new_notification', notification);

    return notification;
  }

  public async getNotificationsForUser(userId: string): Promise<Notification[]> {
    const notification = await this.notification.findMany({ where: { receiverId: userId }, orderBy: { createdAt: 'desc' } });
    return notification;
  }

  public async markAsRead(notificationId: string): Promise<Notification> {
    const notification = await this.notification.update({ where: { id: notificationId }, data: { read: true } });
    return notification;
  }
}
