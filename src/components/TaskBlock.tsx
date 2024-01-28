import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';

import { Task } from '../types';

type TaskBlockProps = {
  task: Task;
  color?: string;
}

const TaskBlock: React.FC<TaskBlockProps> = ({ task, color = '#e3e3e3' }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity style={[styles.block, { backgroundColor: color }]} onPress={() => navigation.navigate('Task Details', { item: task })}>
      <Text style={styles.taskName}>{task.name}</Text>
      <Text style={styles.taskDue}>{moment(task.dueDate).format('HH:mm')}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  block: {
    marginVertical: 5,
    padding: 5,
    width: '100%',
    borderRadius: 10,
    elevation: 4,
  },
  taskName: {
    fontSize: 12,
    fontWeight: '600',
  },
  taskDue: {
    fontSize: 11,
  },
});

export default TaskBlock;
