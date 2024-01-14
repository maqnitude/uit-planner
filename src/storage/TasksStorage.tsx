import AsyncStorage from '@react-native-async-storage/async-storage';

import { Task } from '../types';

const TASKS_KEY = 'tasks';

let cachedTasks: Task[] | undefined;

async function storeTasksToStorage(tasks: Task[]) {
  cachedTasks = tasks;
  await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
};

async function getTasksFromStorage(): Promise<Task[] | undefined> {
  if (cachedTasks !== undefined) {
    return cachedTasks;
  }

  const result = await AsyncStorage.getItem(TASKS_KEY);
  return result !== null ? JSON.parse(result) : undefined;
};

export const storeTask = async (task: Task) => {
  try {
    const tasks = await getTasksFromStorage() || [];
    tasks.push(task);
    await storeTasksToStorage(tasks);
  } catch (error) {
    console.error('Error storing task:', error);
    throw error;
  }
};

export const storeTasks = async (newTasks: Task[]) => {
  try {
    const tasks = await getTasksFromStorage() || [];
    tasks.push(...newTasks);
    await storeTasksToStorage(tasks);
  } catch (error) {
    console.error('Error storing tasks:', error);
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

export const getAllTasks = async (): Promise<Task[] | undefined> => {
  try {
    return await getTasksFromStorage();
  } catch (error) {
    console.error('Error fetching tasks:', error);
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

export const removeAllTasks = async () => {
  try {
    cachedTasks = [];
    await AsyncStorage.removeItem(TASKS_KEY);
  } catch (error) {
    console.error('Error removing all tasks:', error);
    throw error;
  }
};
