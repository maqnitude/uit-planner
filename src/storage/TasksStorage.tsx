import AsyncStorage from '@react-native-async-storage/async-storage';

import { Task } from '../types';

const TASKS_KEY = 'tasks';

let cachedTasks: Task[] | undefined;

async function getTasksFromStorage(): Promise<Task[] | undefined> {
  if (cachedTasks !== undefined) {
    return cachedTasks;
  }

  const result = await AsyncStorage.getItem(TASKS_KEY);
  return result !== null ? JSON.parse(result) : [];
}

export const storeTask = async (task: Task) => {
  try {
    cachedTasks = await getTasksFromStorage();
    cachedTasks?.push(task);
    await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(cachedTasks));
  } catch (error) {
    console.error('Error storing task:', error);
    throw error;
  }
};

export const getAllTasks = async (): Promise<Task[] | undefined> => {
  try {
    return await getTasksFromStorage();
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

export const getTask = async (id: string): Promise<Task | undefined> => {
  try {
    const tasks = await getTasksFromStorage();
    return tasks?.find(task => task.id === id);
  } catch (error) {
    console.error('Error fetching task:', error);
    throw error;
  }
};

export const getTasksByCourseId = async (courseId: string): Promise<Task[]> => {
  try {
    const tasks = await getTasksFromStorage();
    return tasks ? tasks.filter(task => task.courseId === courseId) : [];
  } catch (error) {
    console.error('Error fetching tasks by course ID:', error);
    throw error;
  }
};

export const removeTask = async (id: string) => {
  try {
    cachedTasks = await getTasksFromStorage();
    cachedTasks = cachedTasks?.filter(task => task.id !== id);
    await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(cachedTasks));
  } catch (error) {
    console.error('Error removing task:', error);
    throw error;
  }
};
