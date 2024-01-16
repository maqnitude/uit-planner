import AsyncStorage from '@react-native-async-storage/async-storage';

import { Course, Semester } from '../types';

const SEMESTERS_KEY = 'semesters';

let cachedSemesters: Semester[] | undefined;

async function storeSemestersToStorage(semesters: Semester[]) {
  cachedSemesters = semesters;
  await AsyncStorage.setItem(SEMESTERS_KEY, JSON.stringify(semesters));
}

async function getSemestersFromStorage(): Promise<Semester[] | undefined> {
  if (cachedSemesters !== undefined) {
    return cachedSemesters;
  }

  const result = await AsyncStorage.getItem(SEMESTERS_KEY);
  return result !== null ? JSON.parse(result) : undefined;
}

export const storeSemester = async (semester: Semester) => {
  try {
    const semesters = await getSemestersFromStorage() || [];
    semesters.push(semester);
    await storeSemestersToStorage(semesters);
  } catch (error) {
    console.error('Error storing semester:', error);
    throw error;
  }
};

export const storeSemesters = async (newSemesters: Semester[]) => {
  try {
    const semesters = await getSemestersFromStorage() || [];
    semesters.push(...newSemesters);
    await storeSemestersToStorage(semesters);
  } catch (error) {
    console.error('Error storing semesters:', error);
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

export const getAllSemesters = async (): Promise<Semester[] | undefined> => {
  try {
    return await getSemestersFromStorage();
  } catch (error) {
    console.error('Error fetching semesters:', error);
    throw error;
  }
};

export const removeSemester = async (id: string) => {
  try {
    let semesters = await getSemestersFromStorage() || [];
    semesters = semesters.filter(semester => semester.id !== id);
  } catch (error) {
    console.error('Error removing semester:', error);
    throw error;
  }
};

export const removeAllSemesters = async () => {
  try {
    cachedSemesters = [];
    await AsyncStorage.removeItem(SEMESTERS_KEY);
  } catch (error) {
    console.error('Error removing all semesters:', error);
    throw error;
  }
}

export const updateSemester = async (updatedSemester: Semester) => {
  try {
    let semesters = await getSemestersFromStorage() || [];
    semesters = semesters?.map(semester => semester.id === updatedSemester.id ? updatedSemester : semester);
    await storeSemestersToStorage(semesters);
  } catch (error) {
    console.error('Error updating semester:', error);
    throw error;
  }
};
