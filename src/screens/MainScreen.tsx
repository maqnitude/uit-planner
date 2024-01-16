import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, ScrollView } from 'react-native';
import ProgressBar from 'react-native-progress/Bar';
import { useFocusEffect } from '@react-navigation/native';

import { Course, Task } from '../types';

import { getAllCourses } from '../storage/CoursesStorage';
import { getAllTasks } from '../storage/TasksStorage';

interface MainScreenProps {
  navigation: any;
  route: any;
}

const CustomProgressBar = ({ startLabel, endLabel, percent }) => {
  return (
    <View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
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

const MainScreen: React.FC<MainScreenProps> = ({ navigation, route }) => {
  const [courses, setCourses] = useState<Course[]>([]);

  const [tasks, setTasks] = useState<Task[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isLoadingTask, setIsLoadingTask] = useState(false);
  const [errorTask, setErrorTask] = useState<string | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      fetchCourses();
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

  useFocusEffect(
    React.useCallback(() => {
      fetchTasks();
    }, [])
  );

  const fetchTasks = async () => {
    setIsLoadingTask(true);
    setErrorTask(null);

    try {
      const fetchedTasks = await getAllTasks();
      setTasks(fetchedTasks ?? []);
    } catch (err) {
      setErrorTask((err as Error).message);
    } finally {
      setIsLoadingTask(false);
    }
  };

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  const todayCourses = courses.filter(course => course.schedule[0].day === today);

  if (todayCourses.length > 0) {
    const now = new Date();
    let nearestCourse = todayCourses[0];

    todayCourses.forEach(course => {
      const courseStartTime = new Date(`${course.schedule[0].startTime} ${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`);
      const timeDiff = courseStartTime - now;

      if (timeDiff > 0 && timeDiff < (new Date(`${nearestCourse.schedule[0].startTime} ${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`) - now)) {
        nearestCourse = course;
      }
    });
  }
  const now = new Date();
  const nearDueDateTasks = tasks
    .filter(task => new Date(task.dueDate) > now)
    .sort((task1, task2) => new Date(task1.dueDate) - new Date(task2.dueDate))
    .slice(0, 5);

  const startDate = new Date('2024-01-01');
  const endDate = new Date('2024-02-20');
  const currentDate = new Date();

  const percentElapsed = ((currentDate - startDate) / (endDate - startDate)) * 100;
  if (todayCourses.length > 0 && nearDueDateTasks.length > 0)
  {
    return (
      <View style={styles.container}>
        <View style={styles.progressContainer}>
          <Text style={styles.title}>Semester Progress</Text>
          <CustomProgressBar
            startLabel={startDate.toLocaleDateString()}
            endLabel={endDate.toLocaleDateString()}
            percent={percentElapsed}
          />
        </View>
        {isLoading && <Text>Loading courses...</Text>}
        {error && <Text style={styles.errorText}>Error loading courses: {error}</Text>}
        {
          // <View style={styles.progressContainer}>
          //   <Text style={styles.title}>Upcoming Course</Text>
          //   <Text style={styles.title}>Name: {nearestCourse.name}</Text>
          //   <Text style={styles.title}>Code: {nearestCourse.code}</Text>
          //   <Text style={styles.title}>Location: {nearestCourse.location}</Text>
          //   <Text style={styles.title}>Start Time: {nearestCourse.schedule[0].startTime.toString()}</Text>
          //   <Text style={styles.title}>End Time: {nearestCourse.schedule[0].endTime.toString()}</Text>
          //   <Button title="Viewing All Course" onPress={() => navigation.navigate('Courses')} />
          // </View>
        }
        {isLoadingTask && <Text>Loading tasks...</Text>}
        {errorTask && <Text style={styles.errorText}>Error loading tasks: {errorTask}</Text>}
        <View style={styles.progressContainer}>
          <Text style={styles.title}>Upcoming Task</Text>
          <View style={styles.taskContainer}>
            <ScrollView>
              {nearDueDateTasks.map((task, index) => (
                <View key={index}>
                  <Text>{task.name}</Text>
                  <Text>{task.type}</Text>
                  <Text>{task.dueDate.toString()}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
          <Button title="Viewing All Tasks" onPress={() => navigation.navigate('Tasks')} />
        </View>
      </View>
    );
  }
  else
    if(nearDueDateTasks.length > 0){
      return(
      <View style={styles.container}>
        <View style={styles.progressContainer}>
          <Text style={styles.title}>Semester Progress</Text>
          <CustomProgressBar
            startLabel={startDate.toLocaleDateString()}
            endLabel={endDate.toLocaleDateString()}
            percent={percentElapsed}
          />
        </View>
        {isLoading && <Text>Loading courses...</Text>}
        {error && <Text style={styles.errorText}>Error loading courses: {error}</Text>}
        <View style={styles.progressContainer}>
          <Text style={styles.title}>Upcoming Course</Text>
          <Text style={styles.title}>There is no upcoming course</Text>
          <Button title="Viewing All Courses" onPress={() => navigation.navigate('Courses')} />
        </View>
        {isLoadingTask && <Text>Loading tasks...</Text>}
        {errorTask && <Text style={styles.errorText}>Error loading tasks: {errorTask}</Text>}
        <View style={styles.progressContainer}>
          <Text style={styles.title}>Upcoming Task</Text>
          <View style={styles.taskContainer}>
            <ScrollView>
              {nearDueDateTasks.map((task, index) => (
                <View key={index}>
                  <Text>{task.name}</Text>
                  <Text>{task.type}</Text>
                  <Text>{task.dueDate.toString()}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
          <Button title="Viewing All Tasks" onPress={() => navigation.navigate('Tasks')} />
        </View>
      </View>
      );
    }
  else
  {
    return (
      <View style={styles.container}>
        <View style={styles.progressContainer}>
          <Text style={styles.title}>Semester Progress</Text>
          <CustomProgressBar
            startLabel={startDate.toLocaleDateString()}
            endLabel={endDate.toLocaleDateString()}
            percent={percentElapsed}
          />
        </View>
        {isLoading && <Text>Loading courses...</Text>}
        {error && <Text style={styles.errorText}>Error loading courses: {error}</Text>}
        <View style={styles.progressContainer}>
          <Text style={styles.title}>Upcoming Course</Text>
          <Text style={styles.title}>There is no upcoming course</Text>
          <Button title="Viewing All Courses" onPress={() => navigation.navigate('Courses')} />
        </View>
        {isLoadingTask && <Text>Loading tasks...</Text>}
        {errorTask && <Text style={styles.errorText}>Error loading tasks: {errorTask}</Text>}
        <View style={styles.progressContainer}>
          <Text style={styles.title}>Upcoming Task</Text>
          <Text style={styles.title}>There is no upcoming task</Text>
          <Button title="Viewing All Tasks" onPress={() => navigation.navigate('Tasks')} />
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  errorText: {
    color: 'red',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  detail: {
    fontSize: 18,
    marginBottom: 10,
  },
  progressContainer: {
    flex: 1,
    padding: 5,
    backgroundColor: '#d3d3d3',
    borderRadius: 5,
    maxHeight: 150,
    marginTop: 20,
  },
  taskContainer: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    height: '60%',
  },
});

export default MainScreen;
