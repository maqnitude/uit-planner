import React, { useState } from 'react';
import { Alert, Button, View, Text, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { getTask } from '../storage/TasksStorage';
import { deleteTask } from '../utils/TaskManager';
import moment from 'moment';
import { Task } from '../types';

interface TaskDetailsScreenProps {
  navigation: any;
  route: any;
}

const TaskDetailsScreen: React.FC<TaskDetailsScreenProps> = ({ navigation, route }) => {
  const { item: task } = route.params;
  const [taskDetails, setTaskDetails] = useState(task);

  useFocusEffect(
    React.useCallback(() => {
      const fetchUpdatedTask = async () => {
        const updatedTask = await getTask(task.id);
        setTaskDetails(updatedTask);
      };
      fetchUpdatedTask();
    }, [task.id])
  );

  const handleDeletePress = async(item: Task) => {
    Alert.alert(
      'Delete Task',
      'Are you sure to delete this task?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            await deleteTask(item);
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Title: {taskDetails.name}</Text>
      <Text style={styles.detail}>Type: {taskDetails.type}</Text>
      <Text style={styles.detail}>Due: {moment(taskDetails.dueDate).format('DD/MM/YYYY hh:mm:ss')}</Text>
      <Text style={styles.detail}>Description:</Text>
      <Text style={styles.textBox}> {taskDetails.description} </Text>
      <View style={styles.buttonContainer}>
        <View style={styles.buttonWrapper}>
          <Button title="Delete" color="#d9534f" onPress={() => handleDeletePress(taskDetails)} />
        </View>
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
    color: '#000',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
  },
  detail: {
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonWrapper: {
    width: 100,
  },
  textBox: {
    margin: 5,
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
  },
});

export default TaskDetailsScreen;
