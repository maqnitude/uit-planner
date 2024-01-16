import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, ScrollView } from 'react-native';
import ProgressBar from 'react-native-progress/Bar';
import { useFocusEffect } from '@react-navigation/native';
import moment from 'moment';

import { Course, Task } from '../types';
import { getAllCourses } from '../storage/CoursesStorage';
import { getAllTasks } from '../storage/TasksStorage';

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
  const [courses, setCourses] = useState<Course[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      fetchCourses();
      fetchTasks();
    }, [])
  );

  const fetchCourses = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const fetchedCourses = await getAllCourses();
      setCourses(fetchedCourses ?? []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTasks = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const fetchedTasks = await getAllTasks();
      setTasks(fetchedTasks ?? []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const currentDayOfWeek = moment().format('dddd');
  const coursesForToday = courses.filter(course => course.schedule[0].day === currentDayOfWeek);

  const currentTime = moment();
  const upcomingTasks = tasks
    .filter(task => moment(task.dueDate).isAfter(currentTime))
    .sort((task1, task2) => moment(task1.dueDate).diff(moment(task2.dueDate)))
    .slice(0, 5);

  const semesterStartDate = moment('2024-01-01');
  const semesterEndDate = moment('2024-02-20');
  const currentDate = moment();

  const semesterProgressPercent = currentDate.diff(semesterStartDate) / semesterEndDate.diff(semesterStartDate) * 100;

  const renderCoursesForToday = () => {
    if (coursesForToday.length > 0) {
      return (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Courses for Today</Text>
          <View style={styles.wrapper}>
            <ScrollView>
              {coursesForToday.map((course, index) => (
                <View key={index} style={styles.courseContainer}>
                  <Text style={styles.boldText}>{course.name} ({course.code})</Text>
                  <Text>Location: {course.location}</Text>
                  <Text>{moment(course.schedule[0].startTime).format('HH:mm')} - {moment(course.schedule[0].endTime).format('HH:mm')}</Text>
                </View>
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
                <View key={index} style={styles.taskContainer}>
                  <Text style={styles.boldText}>{task.name}</Text>
                  <Text>{task.type}</Text>
                  <Text>{moment(task.dueDate).format('HH:mm:ss DD/MM/YYYY')}</Text>
                </View>
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

  return (
    <ScrollView style={styles.mainContainer} contentContainerStyle={{ paddingBottom: 50 }}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Semester Progress</Text>
        <CustomProgressBar
          startLabel={semesterStartDate.format('DD-MM-YYYY')}
          endLabel={semesterEndDate.format('DD-MM-YYYY')}
          percent={semesterProgressPercent}
        />
      </View>
      {isLoading && <Text>Loading courses...</Text>}
      {error && <Text style={styles.errorText}>Error loading courses: {error}</Text>}
      {renderCoursesForToday()}
      {isLoading && <Text>Loading tasks...</Text>}
      {error && <Text style={styles.errorText}>Error loading tasks: {error}</Text>}
      {renderUpcomingTasks()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 20,
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
    marginBottom: 10,
  },
  courseContainer: {
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
  },
  boldText: {
    fontWeight: 'bold',
  },
});

export default HomeScreen;
