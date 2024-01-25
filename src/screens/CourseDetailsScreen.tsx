import React, { useState } from 'react';
import { Alert, View, Text, StyleSheet, Button, ScrollView, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import moment from 'moment';

import { getCourse, removeCourse } from '../storage/CoursesStorage';
import { getTasksByCourse } from '../storage/TasksStorage';
import { Task } from '../types';
import { Course } from '../types';

interface CourseDetailsScreenProps {
  navigation: any;
  route: any;
}

const CourseDetailsScreen: React.FC<CourseDetailsScreenProps> = ({ navigation, route }) => {
  const { item: course } = route.params;
  const [courseDetails, setCourseDetails] = useState(course);
  const [tasks, setTasks] = useState<Task[] | undefined>([]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchUpdatedCourseAndTasks = async () => {
        const updatedCourse = await getCourse(course.id);
        const courseTasks = await getTasksByCourse(course.id);
        setCourseDetails(updatedCourse);
        setTasks(courseTasks);
      };
      fetchUpdatedCourseAndTasks();
    }, [course.id])
  );

  const handleDeletePress = async (item: Course) => {
    Alert.alert(
      'Delete Course',
      'Are you sure to delete this course?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            await removeCourse(item.id);
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>{courseDetails.code} - {courseDetails.name}</Text>
        <Text style={styles.detail}>Credits: {courseDetails.credits}</Text>
        <Text style={styles.detail}>Location: {courseDetails.location}</Text>
        <Text style={styles.detail}>Time: {courseDetails.schedule[0].day}, {moment(courseDetails.schedule[0].startTime).format('HH:mm:ss')} - {moment(courseDetails.schedule[0].endTime).format('HH:mm:ss')}</Text>
        <View style={styles.tasksContainer}>
          <ScrollView>
            {tasks?.map((task, index) => (
              <TouchableOpacity key={index} style={styles.taskBlock} onPress={() => navigation.navigate('Task Details', { item: task })}>
                <Text style={styles.boldText}>{task.name}</Text>
                <Text>@{task.type}</Text>
                <Text>Due: {moment(task.dueDate).format('HH:mm:ss DD/MM/YYYY')}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <View style={styles.buttonContainer}>
          <View style={styles.leftButtons}>
            <Button title="Edit" onPress={() => navigation.navigate('Edit Course', { course: courseDetails })} />
            <Button title="Delete" color="#d9534f" onPress={() => handleDeletePress(courseDetails)} />
          </View>
          <Button title="Add task" onPress={() => navigation.navigate('Add Task', { course: courseDetails })} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 50,
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 120,
  },
  tasksContainer: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    height: '60%',
  },
  taskBlock: {
    marginVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    borderStyle: 'dashed',
  },
  boldText: {
    fontWeight: 'bold',
  },
});

export default CourseDetailsScreen;
