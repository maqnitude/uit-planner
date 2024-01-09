import AsyncStorage from "@react-native-async-storage/async-storage";

import { Course, Task } from "../types";

const TASKS_KEY = 'tasks';

let cachedTasks: Task[] | undefined;

async function getTasksFromStorage(): Promise<Task[] | undefined> {
  if (cachedTasks !== undefined) {
    return cachedTasks;
  }

  const result = await AsyncStorage.getItem(TASKS_KEY);
  return result !== null ? JSON.parse(result) : [];
}

export const storeTask = async (semester: Task) => {
  try {
    cachedTasks = await getTasksFromStorage();
    cachedTasks?.push(semester);
    await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(cachedTasks));
  } catch (error) {
    console.error("Error storing semester:", error);
    throw error;
  }
};

export const getAllTasks = async (): Promise<Task[] | undefined> => {
  try {
    return await getTasksFromStorage();
  } catch (error) {
    console.error("Error fetching semesters:", error);
    throw error;
  }
}

export const getTask = async (id: string): Promise<Task | undefined> => {
  try {
    const semesters = await getTasksFromStorage();
    return semesters?.find(semester => semester.id === id);
  } catch (error) {
    console.error("Error fetching semester:", error);
    throw error;
  }
}

export const removeTask = async (id: string) => {
  try {
    cachedTasks = await getTasksFromStorage();
    cachedTasks = cachedTasks?.filter(semester => semester.id !== id);
    await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(cachedTasks));
  } catch (error) {
    console.error("Error removing semester:", error);
    throw error;
  }
}
