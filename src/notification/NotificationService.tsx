import notifee, { TimestampTrigger, TriggerType } from '@notifee/react-native';

export async function displayNotification(id: string, title: string, body: string, date: Date) {
  await notifee.requestPermission();

  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: date.getTime(),
  };

  const channelId = 'task-channel';

  await notifee.createTriggerNotification({
    id: id,
    title: title,
    body: body,
    android: {
      channelId,
      pressAction: {
        id: 'default',
      },
    },
  }, trigger);
}

export async function cancelNotificationById(notificationId: string) {
  await notifee.cancelNotification(notificationId);
}
