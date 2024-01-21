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

const morningTimeStamps = ['7:30', '8:15', '9:00', '10:00'];
const afternoonTimeStamps = ['13:00', '13:45', '14:30', '15:30'];
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const courseCodePrefix = ['CS', 'SE'];
const coursePeriods = [2, 3, 4, 5];
const courseCredits = [2, 3, 4, 10];
const courseLocationPrefix = ['B', 'C'];
const MAX_COURSES_PER_DAY = 3;

export const generateCourses = (semesters: Semester[], num_courses: number = 6): Course[] => {
  const courses: Course[] = [];
  const morningSchedules: {[key: string]: string[]} = {};
  const afternoonSchedules: {[key: string]: string[]} = {};
  const courseCountPerDay: {[key: string]: number} = {};
  const latestEndTimeMorning: {[key: string]: Date} = {};
  const latestEndTimeAfternoon: {[key: string]: Date} = {};

  semesters.forEach(semester => {
    days.forEach(day => {
      morningSchedules[day] = [...morningTimeStamps];
      afternoonSchedules[day] = [...afternoonTimeStamps];
      courseCountPerDay[day] = 0;
      latestEndTimeMorning[day] = new Date(`1970-01-01T${morningTimeStamps[0]}`);
      latestEndTimeAfternoon[day] = new Date(`1907-01-01T${afternoonTimeStamps[0]}`)
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
      } while (courseCountPerDay[day] >= MAX_COURSES_PER_DAY || (morningSchedules[day].length === 0 || afternoonSchedules[day].length === 0));

      let startTimeStamp: string;
      let startTime: Date;

      if (morningSchedules[day].some(timeStamp => new Date(`1970-01-01T${timeStamp}:00`) >= latestEndTimeMorning[day])) {
        do {
          startTimeStamp = morningSchedules[day].splice(Math.floor(Math.random() * morningSchedules[day].length), 1)[0];
          startTime = new Date(`1970-01-01T${startTimeStamp}:00`);
        } while (startTime < latestEndTimeMorning[day]);
      } else if (afternoonSchedules[day].some(timeStamp => new Date(`1970-01-01T${timeStamp}:00`) >= latestEndTimeAfternoon[day])) {
        do {
          startTimeStamp = afternoonSchedules[day].splice(Math.floor(Math.random() * afternoonSchedules[day].length), 1)[0];
          startTime = new Date(`1970-01-01T${startTimeStamp}:00`);
        } while (startTime < latestEndTimeAfternoon[day]);
      } else {
        console.log(`No more valid time slots for ${day}.`)
        continue;
      }

      let num_periods = coursePeriods[Math.floor(Math.random() * coursePeriods.length)];
      let endTime = new Date(startTime.getTime() + 45 * num_periods * 60 * 1000);
      let endTimeHours = endTime.getHours();
      let endTimeMinutes = endTime.getMinutes();

      if ((endTimeHours === 11 && endTimeMinutes > 30) || (endTimeHours ===12) ||  (endTimeHours === 13)) {
        endTime = new Date('1970-01-01T11:30:00');
      } else if (endTimeHours > 17 || (endTimeHours === 17 && endTimeMinutes > 45)) {
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
      if (endTime.getHours() < 12) {
        latestEndTimeMorning[day] = endTime;
      } else {
        latestEndTimeAfternoon[day] = endTime;
      }
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
