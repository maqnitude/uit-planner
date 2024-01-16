export interface Course {
  id: string;
  name: string;
  code: string;
  credits: number;
  location: string;
  semesterId: string;
  schedule: ClassPeriod[];
}

export interface ClassPeriod {
  day: string;
  startTime: Date;
  endTime: Date;
}

export interface Semester {
  id: string;
  name: string;
  start: Date;
  end: Date;
}

export interface Task {
  id: string;
  name: string;
  type: string;
  dueDate: Date;
  courseId: string;
  description: string;
  completed: boolean;
}
