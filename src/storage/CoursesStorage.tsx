import AsyncStorage from '@react-native-async-storage/async-storage';

import { Course } from '../types';

const COURSES_KEY = 'courses';

let cachedCourses: Course[] | undefined;

async function getCoursesFromStorage(): Promise<Course[] | undefined> {
  if (cachedCourses !== undefined) {
    return cachedCourses;
  }

  const result = await AsyncStorage.getItem(COURSES_KEY);
  return result !== null ? JSON.parse(result) : [];
}

export const storeCourse = async (course: Course) => {
  try {
    cachedCourses = await getCoursesFromStorage(); // Get courses from storage or cache
    cachedCourses?.push(course);
    await AsyncStorage.setItem(COURSES_KEY, JSON.stringify(cachedCourses));
  } catch (error) {
    console.error('Error storing course:', error);
    throw error; // Rethrow to signal error to caller
  }
};

export const getAllCourses = async (): Promise<Course[] | undefined> => {
  try {
    return await getCoursesFromStorage();
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
};

export const getCourse = async (id: string): Promise<Course | undefined> => {
  try {
    const courses = await getCoursesFromStorage();
    return courses?.find(course => course.id === id);
  } catch (error) {
    console.error('Error fetching course:', error);
    throw error;
  }
};

export const removeCourse = async (id: string) => {
  try {
    cachedCourses = await getCoursesFromStorage(); // Refresh cache
    cachedCourses = cachedCourses?.filter(course => course.id !== id);
    await AsyncStorage.setItem(COURSES_KEY, JSON.stringify(cachedCourses));
  } catch (error) {
    console.error('Error removing course:', error);
    throw error;
  }
};

export const updateCourse = async (updatedCourse: Course) => {
  try {
    cachedCourses = await getCoursesFromStorage();
    cachedCourses = cachedCourses?.map(course => course.id === updatedCourse.id ? updatedCourse : course);
    await AsyncStorage.setItem(COURSES_KEY, JSON.stringify(cachedCourses));
  } catch (error) {
    console.error('Error updating course:', error);
    throw error;
  }
};
