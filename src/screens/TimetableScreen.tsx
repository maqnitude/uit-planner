import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, Dimensions, StyleSheet } from 'react-native';
import moment from 'moment';
import { useFocusEffect } from '@react-navigation/native';

import CourseBlock from '../components/CourseBlock';
import TaskBlock from '../components/TaskBlock';
import { Course, Task } from '../types';
import { getCoursesBySemester } from '../storage/CoursesStorage';
import { getTasksBySemester } from '../storage/TasksStorage';
import { useCurrentSemester } from '../hooks/CurrentSemesterContext';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const TIME_STAMPS = ['7:30', '8:15', '9:00', '10:00', '10:45', '11:30', '13:00', '13:45', '14:30', '15:30', '16:15', '17:00'];
const DAY_COLORS = {
  'Monday': '#CBE4F9',
  'Tuesday': '#CDF5F6',
  'Wednesday': '#EFF9DA',
  'Thursday': '#F9EBDF',
  'Friday': '#F9D8D6',
  'Saturday': '#D6CDEA',
};
const TIMES = TIME_STAMPS.map(time => moment(time, 'HH:mm'));

const TimeTable = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const { currentSemesterId } = useCurrentSemester();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);

  const fetchCourses = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      let fetchedCourses: Course[] | undefined;

      if (currentSemesterId) {
        fetchedCourses = await getCoursesBySemester(currentSemesterId);
      }

      setCourses(fetchedCourses ?? []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, [currentSemesterId]);

  const fetchTasks = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      let fetchedTasks: Task[] | undefined;

      if (currentSemesterId) {
        fetchedTasks = await getTasksBySemester(currentSemesterId);
      }

      setTasks(fetchedTasks ?? []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, [currentSemesterId]);

  useFocusEffect(
    React.useCallback(() => {
      fetchCourses();
      fetchTasks();
    }, [fetchCourses, fetchTasks])
  );

  useEffect(() => {
    const updateWidth = () => {
      setScreenWidth(Dimensions.get('window').width);
    };

    const subscription = Dimensions.addEventListener('change', updateWidth);

    return () => {
      subscription?.remove();
    };
  }, []);

  const isThisWeek = (date: Date) => {
    const now = moment();
    const startOfWeek = now.clone().startOf('isoWeek');
    const endOfWeek = now.clone().endOf('isoWeek');
    const momentDate = moment(date);
    console.log(startOfWeek.format('DD:MM:YYYY'), endOfWeek.format('DD:MM:YYYY'));
    return momentDate.isBetween(startOfWeek, endOfWeek, undefined, '[]');
  };

  const timeStampWidth = 50;
  const headerHeight = 30;
  const unitHeight = 90;
  const heights = TIMES.map((time, index) => {
    const timeEnd = TIMES[index + 1];
    let height = unitHeight;
    if (timeEnd) {
      const duration = timeEnd.diff(time, 'minutes');
      height = duration * (unitHeight / 45);
    }
    return height;
  });

  return (
    <>
      {isLoading && <Text>Loading timetable...</Text>}
      {error && <Text style={styles.errorText}>Error loading timetable: {error}</Text>}
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.row}>
            <View style={{ marginBottom: unitHeight, marginTop: headerHeight }}>
              {TIME_STAMPS.map((time, index) => (
                <View key={index} style={[styles.timeStamp, { width: timeStampWidth, height: heights[index], borderTopWidth: index === 0 ? 0.5 : 0 }]}>
                  <Text style={styles.boldText}>{time}</Text>
                </View>
              ))}
            </View>
            <ScrollView horizontal>
              <View style={styles.row}>
                {DAYS.map((day, dayIndex) => (
                  <View key={dayIndex} style={{ width: (screenWidth - timeStampWidth) / (screenWidth > 600 ? 6 : 3) }}>
                    <Text style={[styles.header, styles.boldText, { height: headerHeight }]}>{day}</Text>
                    {TIMES.map((time, timeIndex) => {
                      return <View key={timeIndex} style={[styles.timeSlot, { height: heights[timeIndex] }]}>
                        {courses.map((course, courseIndex) => {
                          const courseStartTime = moment(course.schedule[0].startTime).format('HH:mm');
                          const courseEndTime = moment(course.schedule[0].endTime).format('HH:mm');
                          const timeSlotEnd = TIMES[timeIndex + 1] ? moment(TIMES[timeIndex + 1]).format('HH:mm') : moment(time).add(45, 'minutes').format('HH:mm');
                          if (courseStartTime >= time.format('HH:mm') && courseStartTime < timeSlotEnd && course.schedule[0].day === day) {
                            const courseDurationMinutes = moment.duration(moment(courseEndTime, 'HH:mm').diff(moment(courseStartTime, 'HH:mm'))).asMinutes();
                            const blockHeight = courseDurationMinutes * unitHeight / 45;
                            const offsetMinutes = moment.duration(moment(courseStartTime, 'HH:mm').diff(moment(time, 'HH:mm'))).asMinutes();
                            const offset = offsetMinutes * unitHeight / 45;
                            return <CourseBlock key={courseIndex} course={course} color={DAY_COLORS[day]} height={blockHeight} offset={offset} />;
                          }
                          return null;
                        })}
                      </View>;
                    })}
                    {tasks.map((task, taskIndex) => {
                      console.log(isThisWeek(task.dueDate));
                      if (isThisWeek(task.dueDate) && moment(task.dueDate).format('dddd') === day) {
                        console.log(task.name);
                        return (
                          <View key={taskIndex} style={{ width: (screenWidth - timeStampWidth) / (screenWidth > 600 ? 6 : 3) }}>
                            <TaskBlock key={taskIndex} task={task} color={DAY_COLORS[day]} />
                          </View>
                        );
                    }
                    return null;
                    })
                    }
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  row: {
    flexDirection: 'row',
  },
  timeStamp: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderRightWidth: 0.5,
  },
  timeSlot: {
    borderRightWidth: 0.5,
    borderBottomWidth: 0.5,
    borderStyle: 'dashed',
  },
  header: {
    fontSize: 15,
    textAlign: 'center',
    backgroundColor: '#b5e2ff',
    borderLeftWidth: 0.5,
    borderBottomWidth: 0.5,
  },
  boldText: {
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
  },
});


export default TimeTable;
