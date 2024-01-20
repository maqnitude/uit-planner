import { Task } from '../types';
import { storeTask, removeTask } from '../storage/TasksStorage';
import { displayNotification, cancelNotificationById } from '../notification/NotificationService';
import moment from 'moment';

export async function createTask(task: Task) {
    await storeTask(task);
    scheduleTaskNotification(task);
}

export async function deleteTask(task: Task) {
    await removeTask(task.id);
    await cancelNotificationById(task.id);
}

function scheduleTaskNotification(task: Task) {
    const dueDateMoment = moment(task.dueDate);
    const now = moment();

    if (dueDateMoment.isAfter(now)) {
        displayNotification(task.id, `Task Due: ${task.name}`, `Your task "${task.name}" is due now.`, dueDateMoment.toDate());

        const notifyDate1HourBefore = dueDateMoment.clone().subtract(1, 'hours');
        if (notifyDate1HourBefore.isAfter(now)) {
            displayNotification(task.id, `Task Due Soon: ${task.name}`, `Your task "${task.name}" is due in 1 hour.`, notifyDate1HourBefore.toDate());
        }

        const notifyDate1DayBefore = dueDateMoment.clone().subtract(1, 'days');
        if (notifyDate1DayBefore.isAfter(now)) {
            displayNotification(task.id, `Task due soon: ${task.name}`, `Your task "${task.name}" is due tomorrow.`, notifyDate1DayBefore.toDate());
        }
    }
}
