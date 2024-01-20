import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import moment from 'moment';

import { getCourse } from '../storage/CoursesStorage';
import { getTasksByCourseId } from '../storage/TasksStorage';
import { Task } from '../types';

interface CourseDetailsScreenProps {
  navigation: any;
  route: any;
}

const CourseDetailsScreen: React.FC<CourseDetailsScreenProps> = ({ navigation, route }) => {
  const { item: course } = route.params;
  const [courseDetails, setCourseDetails] = useState(course);
  const [tasks, setTasks] = useState<Task[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchUpdatedCourseAndTasks = async () => {
        const updatedCourse = await getCourse(course.id);
        const courseTasks = await getTasksByCourseId(course.id);
        setCourseDetails(updatedCourse);
        setTasks(courseTasks);
      };
      fetchUpdatedCourseAndTasks();
    }, [course.id])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{courseDetails.name}</Text>
      <Text style={styles.detail}>Code: {courseDetails.code}</Text>
      <Text style={styles.detail}>Credits: {courseDetails.credits}</Text>
      <Text style={styles.detail}>Location: {courseDetails.location}</Text>
      <View style={styles.taskContainer}>
        <ScrollView>
          {tasks.map((task, index) => (
            <View key={index}>
              <Text style={styles.boldText}>{task.name}</Text>
              <Text>@{task.type}</Text>
              <Text>Due: {moment(task.dueDate).format('HH:mm:ss DD/MM/YYYY')}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Edit" onPress={() => navigation.navigate('Edit Course', { course: courseDetails })} />
        <Button title="Add task" onPress={() => navigation.navigate('Add Task', { course: courseDetails })} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  taskContainer: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    height: '60%',
  },
  boldText: {
    fontWeight: 'bold',
  },
});

export default CourseDetailsScreen;
