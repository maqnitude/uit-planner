import AsyncStorage from '@react-native-async-storage/async-storage';

import { Course } from '../types';

const COURSES_KEY = 'courses';

let cachedCourses: Course[] | undefined;

async function storeCoursesToStorage(courses: Course[]) {
  cachedCourses = courses;
  await AsyncStorage.setItem(COURSES_KEY, JSON.stringify(courses));
};

async function getCoursesFromStorage(): Promise<Course[] | undefined> {
  if (cachedCourses !== undefined) {
    return cachedCourses;
  }

  const result = await AsyncStorage.getItem(COURSES_KEY);
  return result !== null ? JSON.parse(result) : undefined;
};

export const storeCourse = async (course: Course) => {
  try {
    const courses = await getCoursesFromStorage() || [];
    courses.push(course);
    await storeCoursesToStorage(courses);
  } catch (error) {
    console.error('Error storing course:', error);
    throw error;
  }
};

export const storeCourses = async (newCourses: Course[]) => {
  try {
    const courses = await getCoursesFromStorage() || [];
    courses.push(...newCourses);
    await storeCoursesToStorage(courses);
  } catch (error) {
    console.error('Error storing courses:', error);
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

export const getAllCourses = async (): Promise<Course[] | undefined> => {
  try {
    return await getCoursesFromStorage();
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
};

export const removeCourse = async (id: string) => {
  try {
    let courses = await getCoursesFromStorage() || [];
    courses = courses.filter(course => course.id !== id);
    await storeCoursesToStorage(courses);
  } catch (error) {
    console.error('Error removing course:', error);
    throw error;
  }
};

export const removeAllCourses = async () => {
  try {
    cachedCourses = [];
    await AsyncStorage.removeItem(COURSES_KEY);
  } catch (error) {
    console.error('Error removing all courses:', error);
    throw error;
  }
};

export const updateCourse = async (updatedCourse: Course) => {
  try {
    let courses = await getCoursesFromStorage() || [];
    courses = courses?.map(course => course.id === updatedCourse.id ? updatedCourse : course);
    await storeCoursesToStorage(courses);
  } catch (error) {
    console.error('Error updating course:', error);
    throw error;
  }
};
