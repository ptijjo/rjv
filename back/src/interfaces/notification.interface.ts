import { NotificationType } from '@prisma/client';

export interface Notification {
  id: string;
  type: NotificationType;
  notifiableId: string;
  read: boolean;
  createdAt: Date;
  receiverId: string;
  senderId: string;
}
