import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, ScrollView, TouchableOpacity } from 'react-native';
import ProgressBar from 'react-native-progress/Bar';
import { useFocusEffect } from '@react-navigation/native';
import moment from 'moment';

import { Semester, Course, Task } from '../types';
import { getCoursesBySemester } from '../storage/CoursesStorage';
import { getTasksBySemester } from '../storage/TasksStorage';
import { useCurrentSemester } from '../hooks/CurrentSemesterContext';
import { getSemester } from '../storage/SemestersStorage';

interface HomeScreenProps {
  navigation: any;
}

interface CustomProgressBarProps {
  startLabel: string;
  endLabel: string;
  percent: number;
}

const CustomProgressBar: React.FC<CustomProgressBarProps> = ({ startLabel, endLabel, percent }) => {
  return (
    <View>
      <View style={styles.progressLabelContainer}>
        <Text>{startLabel}</Text>
        <Text>{endLabel}</Text>
      </View>
      <ProgressBar
        progress={percent / 100}
        width={null}
        height={20}
        color="#009688"
        borderRadius={5}
      />
    </View>
  );
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { currentSemesterId } = useCurrentSemester();
  const [courses, setCourses] = useState<Course[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentSemester, setCurrentSemester] = useState<Semester | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCurrentSemester = React.useCallback(async () => {
    if (currentSemesterId) {
      const semester = await getSemester(currentSemesterId);
      setCurrentSemester(semester ?? null);
    } else {
      setCurrentSemester(null);
    }
  }, [currentSemesterId]);

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
      fetchCurrentSemester();
    }, [fetchCourses, fetchTasks, fetchCurrentSemester])
  );

  const currentDayOfWeek = moment().format('dddd');
  const coursesForToday = courses.filter(course => course.schedule[0].day === currentDayOfWeek);

  const currentTime = moment();
  const upcomingTasks = tasks
    .filter(task => moment(task.dueDate).isAfter(currentTime))
    .sort((task1, task2) => moment(task1.dueDate).diff(moment(task2.dueDate)))
    .slice(0, 5);

  const renderCoursesForToday = () => {
    if (coursesForToday.length > 0) {
      return (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Courses for Today</Text>
          <View style={styles.wrapper}>
            <ScrollView>
              {coursesForToday.map((course, index) => (
                <TouchableOpacity key={index} style={styles.courseContainer} onPress={() => navigation.navigate('Course Details', { item: course })}>
                  <Text style={styles.boldText}>{course.name} ({course.code})</Text>
                  <Text>Location: {course.location}</Text>
                  <Text>{moment(course.schedule[0].startTime).format('HH:mm')} - {moment(course.schedule[0].endTime).format('HH:mm')}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          <Button title="View All Courses" onPress={() => navigation.navigate('Courses')} />
        </View>
      );
    } else {
      return (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Courses for Today</Text>
          <Text>There are no courses today</Text>
          <Button title="View All Courses" onPress={() => navigation.navigate('Courses')} />
        </View>
      );
    }
  };

  const renderUpcomingTasks = () => {
    if (upcomingTasks.length > 0) {
      return (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tasks Due Soon</Text>
          <View style={styles.wrapper}>
            <ScrollView>
              {upcomingTasks.map((task, index) => (
                <TouchableOpacity key={index} style={styles.taskContainer} onPress={() => navigation.navigate('Task Details', { item: task })}>
                  <Text style={styles.boldText}>{task.name}</Text>
                  <Text>{task.type}</Text>
                  <Text>{moment(task.dueDate).format('HH:mm:ss DD/MM/YYYY')}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          <Button title="View All Tasks" onPress={() => navigation.navigate('Tasks')} />
        </View>
      );
    } else {
      return (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tasks Due Soon</Text>
          <Text>There are no tasks due soon</Text>
          <Button title="View All Tasks" onPress={() => navigation.navigate('Tasks')} />
        </View>
      );
    }
  };

  if (currentSemester) {
    const semesterStartDate = moment(currentSemester.start);
    const semesterEndDate = moment(currentSemester.end);
    const currentDate = moment();
    let semesterProgressPercent = currentDate.diff(semesterStartDate) / semesterEndDate.diff(semesterStartDate) * 100;
    semesterProgressPercent = Math.max(Math.min(semesterProgressPercent, 100), 0);
    return (
      <ScrollView style={styles.mainContainer} contentContainerStyle={styles.contentContainer}>
        {currentSemester ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Semester Progress</Text>
            <CustomProgressBar
              startLabel={semesterStartDate.format('DD-MM-YYYY')}
              endLabel={semesterEndDate.format('DD-MM-YYYY')}
              percent={semesterProgressPercent}
            />
          </View>
        ) : (
          <Text>No current semester</Text>
        )}
        {isLoading && <Text>Loading courses...</Text>}
        {error && <Text style={styles.errorText}>Error loading courses: {error}</Text>}
        {renderCoursesForToday()}
        {isLoading && <Text>Loading tasks...</Text>}
        {error && <Text style={styles.errorText}>Error loading tasks: {error}</Text>}
        {renderUpcomingTasks()}
      </ScrollView>
    );
  } else {
    return (
      <ScrollView style={styles.mainContainer} contentContainerStyle={styles.contentContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Welcome to your planner!</Text>
          <Button title="Set up a new semester now" onPress={() => navigation.navigate('Semesters')} />
        </View>
      </ScrollView>
    );
  }
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 20,
  },
  contentContainer: {
    paddingBottom: 50,
  },
  section: {
    padding: 5,
    borderRadius: 5,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  progressLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  wrapper: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },
  taskContainer: {
    marginVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    borderStyle: 'dashed',
  },
  courseContainer: {
    marginVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    borderStyle: 'dashed',
  },
  errorText: {
    color: 'red',
  },
  boldText: {
    fontWeight: 'bold',
  },
});

export default HomeScreen;
