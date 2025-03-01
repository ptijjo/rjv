import { NotificationType } from '@prisma/client';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class CreateNotificationDto {
  @IsIn(Object.values(NotificationType))
  public type: NotificationType;

  @IsString()
  @IsNotEmpty()
  public notifiableId: string;
}
