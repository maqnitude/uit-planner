import AsyncStorage from '@react-native-async-storage/async-storage';

import { Course } from '../types';
import { removeAllTasks, removeTasksByCourse, removeTasksByCourses } from './TasksStorage';

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

export const getCoursesBySemester = async (semesterId: string): Promise<Course[] | undefined> => {
  try {
    const courses = await getCoursesFromStorage();
    return courses?.filter(course => course.semesterId === semesterId);
  } catch (error) {
    console.error('Error fetching courses by semester:', error);
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

export const removeCourse = async (id: string, cascade: boolean = true) => {
  try {
    let courses = await getCoursesFromStorage() || [];
    courses = courses.filter(course => course.id !== id);
    await storeCoursesToStorage(courses);

    if (cascade) {
      await removeTasksByCourse(id);
    }
  } catch (error) {
    console.error('Error removing course:', error);
    throw error;
  }
};

export const removeCourses = async (ids: string[], cascade: boolean = true) => {
  try {
    const courses = await getCoursesFromStorage() || [];
    let idSet = new Set(ids);
    const coursesToDelete = courses.filter(course => idSet.has(course.id));
    const newCourses = courses.filter(course => !idSet.has(course.id));
    await storeCoursesToStorage(newCourses);

    if (cascade) {
      const courseIds = coursesToDelete.map(course => course.id);
      await removeTasksByCourses(courseIds);
    }
  } catch (error) {
    console.error('Error removing courses:', error);
    throw error;
  }
};

export const removeCoursesBySemester = async (semesterId: string, cascade: boolean = true) => {
  try {
    const courses = await getCoursesFromStorage() || [];
    const coursesToDelete = courses.filter(course => course.semesterId === semesterId);
    const newCourses = courses.filter(course => course.semesterId !== semesterId);
    await storeCoursesToStorage(newCourses);

    if (cascade) {
      const courseIds = coursesToDelete.map(course => course.id);
      await removeTasksByCourses(courseIds);
    }
  } catch (error) {
    console.error('Error removing courses by semester:', error);
    throw error;
  }
};

export const removeAllCourses = async (cascade: boolean = true) => {
  try {
    cachedCourses = [];
    await AsyncStorage.removeItem(COURSES_KEY);

    if (cascade) {
      await removeAllTasks();
    }
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
