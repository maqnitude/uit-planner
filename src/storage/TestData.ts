import { v4 as uuidv4 } from 'uuid'
import { Course, ClassPeriod } from '../types'

export const testCourses: Course[] = [
  {
    id: uuidv4(),
    name: 'Multimedia Mobile App Development',
    code: 'CS526',
    credits: 4,
    location: 'C316',
    schedule: [{
      day: 'Monday',
      startTime: new Date('1970-01-01T7:30:00'),
      endTime: new Date('1970-01-01T9:45:00')
    } as ClassPeriod]
  },
  {
    id: uuidv4(),
    name: 'Machine Learning',
    code: 'CS114',
    credits: 4,
    location: 'C316',
    schedule: [{
      day: 'Monday',
      startTime: new Date('1970-01-01T13:45:00'),
      endTime: new Date('1970-01-01T16:15:00')
    } as ClassPeriod]
  },
  {
    id: uuidv4(),
    name: 'Natural Language Processing',
    code: 'CS221',
    credits: 4,
    location: 'C316',
    schedule: [{
      day: 'Tuesday',
      startTime: new Date('1970-01-01T7:30:00'),
      endTime: new Date('1970-01-01T9:45:00')
    } as ClassPeriod]
  },
  {
    id: uuidv4(),
    name: 'Computational Thinking',
    code: 'CS117',
    credits: 4,
    location: 'B1.18',
    schedule: [{
      day: 'Tuesday',
      startTime: new Date('1970-01-01T13:00:00'),
      endTime: new Date('1970-01-01T15:15:00')
    } as ClassPeriod]
  },
  {
    id: uuidv4(),
    name: 'Software Testing',
    code: 'SE113',
    credits: 4,
    location: 'C310',
    schedule: [{
      day: 'Wednesday',
      startTime: new Date('1970-01-01T7:30:00'),
      endTime: new Date('1970-01-01T10:45:00')
    } as ClassPeriod]
  },
  {
    id: uuidv4(),
    name: 'Shit 1',
    code: 'SS008',
    credits: 2,
    location: 'B6.12',
    schedule: [{
      day: 'Friday',
      startTime: new Date('1970-01-01T10:45:00'),
      endTime: new Date('1970-01-01T11:30:00')
    } as ClassPeriod]
  },
  {
    id: uuidv4(),
    name: 'Shit 2',
    code: 'SS009',
    credits: 2,
    location: 'B5.08',
    schedule: [{
      day: 'Friday',
      startTime: new Date('1970-01-01T13:00:00'),
      endTime: new Date('1970-01-01T14:30:00')
    } as ClassPeriod]
  },
];
