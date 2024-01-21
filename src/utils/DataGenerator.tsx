import { v4 as uuidv4 } from 'uuid'
import { Course, ClassPeriod, Task, Semester } from '../types'

export const generateSemesters = (num_semesters: number = 1): Semester[] => {
  const semesters: Semester[] = [];

  for (let i = 0; i < num_semesters; i++) {
    const semester: Semester = {
      id: uuidv4(),
      name: `Semeter ${i}`,
      start: new Date('2024-01-01'),
      end: new Date('2024-05-01'),
    };

    semesters.push(semester);
  }

  return semesters;
};

const timeStamps = ['7:30', '8:15', '9:00', '10:00', '10:45', '13:00', '13:45', '14:30', '15:15'];
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const courseCodePrefix = ['CS', 'SE'];
const coursePreiods = [2, 3, 4, 5];
const courseCredits = [2, 3, 4, 10];
const courseLocationPrefix = ['B', 'C'];

export const generateCourses = (semesters: Semester[], num_courses: number = 6): Course[] => {
  const courses: Course[] = [];
  const daySchedules: {[key: string]: string[]} = {};
  const courseCountPerDay: {[key: string]: number} = {};
  const latestEndTime: {[key: string]: Date} = {};

  semesters.forEach(semester => {
    days.forEach(day => {
      daySchedules[day] = [...timeStamps];
      courseCountPerDay[day] = 0;
      latestEndTime[day] = new Date(`1970-01-01T${timeStamps[0]}`);
    });

    for (let i = 0; i < num_courses; i++) {
      const course: Course = {
        id: uuidv4(),
        name: `Course ${i}`,
        code: `${courseCodePrefix[Math.floor(Math.random() * courseCodePrefix.length)]}${i}${i}${i}`,
        credits: courseCredits[Math.floor(Math.random() * courseCredits.length)],
        location: `${courseLocationPrefix[Math.floor(Math.random() * courseLocationPrefix.length)]}${i}${i}${i}`,
        semesterId: semester.id,
        schedule: []
      };

      let day: string;
      do {
        day = days[Math.floor(Math.random() * days.length)];
      } while (courseCountPerDay[day] >= 2 || daySchedules[day].length === 0);

      let startTimeStamp: string;
      let startTime: Date;
      do {
        startTimeStamp = daySchedules[day].splice(Math.floor(Math.random() * daySchedules[day].length), 1)[0];
        startTime = new Date(`1970-01-01T${startTimeStamp}:00`);
      } while (startTime < latestEndTime[day]);


      const num_periods = coursePreiods[Math.floor(Math.random() * coursePreiods.length)];
      let endTime = new Date(startTime.getTime() + 45 * num_periods * 60 * 1000);
      if (endTime.getHours() > 17 || (endTime.getHours() === 17 && endTime.getMinutes() > 45)) {
        endTime = new Date('1970-01-01T17:45:00');
      }

      const classPeriod: ClassPeriod = {
        day,
        startTime,
        endTime
      }

      course.schedule.push(classPeriod);
      courses.push(course);

      courseCountPerDay[day]++;
      latestEndTime[day] = endTime;
    }
  });

  return courses;
};

export const generateTasks = (courses: Course[]): Task[] => {
  const tasks: Task[] = [];

  courses.forEach(course => {
    const numTasks: number = 1 + Math.floor(Math.random() * 4);
    for (let i = 0; i < numTasks; i++) {
      const numWeeks: number = 1 + Math.floor(Math.random() * 3);
      const task: Task = {
        id: uuidv4(),
        name: `${course.name} Task ${i}`,
        type: 'Assignment',
        dueDate: new Date(Date.now() + 7 * numWeeks * 24 * 60 * 60 * 1000),
        courseId: course.id,
        description: `This is task ${i} for the course ${course.name}.`,
        completed: false,
      };

      tasks.push(task);
    }
  });

  return tasks;
};
