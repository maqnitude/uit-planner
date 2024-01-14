import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { getTask } from '../storage/TasksStorage';
import moment from 'moment';

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Title: {taskDetails.name}</Text>
      <Text style={styles.detail}>Type: {taskDetails.type}</Text>
      <Text style={styles.detail}>Due: {moment(taskDetails.dueDate).format('DD/MM/YYYY hh:mm:ss')}</Text>
      <Text style={styles.detail}>Description:</Text>
      <Text style={styles.textBox}> {taskDetails.description} </Text>
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
  textBox: {
    margin: 5,
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
  },
});

export default TaskDetailsScreen;
