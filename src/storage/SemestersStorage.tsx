import AsyncStorage from '@react-native-async-storage/async-storage';

import { Course, Semester } from '../types';

const SEMESTERS_KEY = 'semesters';

let cachedSemesters: Semester[] | undefined;

async function getSemestersFromStorage(): Promise<Semester[] | undefined> {
  if (cachedSemesters !== undefined) {
    return cachedSemesters;
  }

  const result = await AsyncStorage.getItem(SEMESTERS_KEY);
  return result !== null ? JSON.parse(result) : [];
}

export const storeSemester = async (semester: Semester) => {
  try {
    cachedSemesters = await getSemestersFromStorage();
    cachedSemesters?.push(semester);
    await AsyncStorage.setItem(SEMESTERS_KEY, JSON.stringify(cachedSemesters));
  } catch (error) {
    console.error('Error storing semester:', error);
    throw error;
  }
};

export const getAllSemesters = async (): Promise<Semester[] | undefined> => {
  try {
    return await getSemestersFromStorage();
  } catch (error) {
    console.error('Error fetching semesters:', error);
    throw error;
  }
};

export const getSemester = async (id: string): Promise<Semester | undefined> => {
  try {
    const semesters = await getSemestersFromStorage();
    return semesters?.find(semester => semester.id === id);
  } catch (error) {
    console.error('Error fetching semester:', error);
    throw error;
  }
};

export const removeSemester = async (id: string) => {
  try {
    cachedSemesters = await getSemestersFromStorage();
    cachedSemesters = cachedSemesters?.filter(semester => semester.id !== id);
    await AsyncStorage.setItem(SEMESTERS_KEY, JSON.stringify(cachedSemesters));
  } catch (error) {
    console.error('Error removing semester:', error);
    throw error;
  }
};
