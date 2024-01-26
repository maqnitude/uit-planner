import React, { useState } from 'react';
import { ScrollView, Alert, Button, View, Text, StyleSheet, TextInput } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { useFocusEffect } from '@react-navigation/native';

import { getTask, updateTask } from '../../storage/TasksStorage';
import { deleteTask } from '../../utils/TaskManager';
import moment from 'moment';
import { Task } from '../../types';

interface TaskDetailsScreenProps {
  navigation: any;
  route: any;
}

const TaskDetailsScreen: React.FC<TaskDetailsScreenProps> = ({ navigation, route }) => {
  const { item: task } = route.params;
  const [taskDetails, setTaskDetails] = useState(task);
  const [description, setDescription] = useState(taskDetails.description);
  const [isSaved, setIsSaved] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      const fetchUpdatedTask = async () => {
        const updatedTask = await getTask(task.id);
        setTaskDetails(updatedTask);
      };
      fetchUpdatedTask();
    }, [task.id])
  );

  const handleToggleComplete = async (item: Task, newValue: boolean) => {
    const updatedTask = { ...item, completed: newValue };
    await updateTask(updatedTask);
    setTaskDetails(updatedTask);
  };

  const handleDescriptionChange = (updatedDescription: string) => {
    setDescription(updatedDescription);
    setIsSaved(false);
  };

  const handleSave = async () => {
    const updatedTask = { ...taskDetails, description };
    await updateTask(updatedTask);
    setTaskDetails(updatedTask);
    setIsSaved(true);
  };

  const handleDeletePress = async (item: Task) => {
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
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <CheckBox
            value={taskDetails.completed}
            onValueChange={(newValue) => handleToggleComplete(taskDetails, newValue)}
          />
          <Text style={[styles.title, taskDetails.completed ? styles.completedTaskTitle : {}]}>{taskDetails.name}</Text>
        </View>
        <Text style={styles.detail}>Status: {taskDetails.completed ? 'Done' : 'Todo'}</Text>
        <Text style={styles.detail}>Type: {taskDetails.type}</Text>
        <Text style={styles.detail}>Due: {moment(taskDetails.dueDate).format('DD/MM/YYYY hh:mm:ss')}</Text>
        <Text style={styles.detail}>Description:</Text>
        <TextInput
          textAlignVertical="top"
          style={styles.textBox}
          onChangeText={handleDescriptionChange}
          value={description}
          multiline={true}
        />
        <View style={styles.messageContainer}>
          <Text style={isSaved ? styles.savedMessage : styles.unsavedMessage}>
            {isSaved ? 'Saved' : 'Unsaved!'}
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <View style={styles.leftButtons}>
            <Button title="Edit" onPress={() => navigation.navigate('Edit Task', { task: taskDetails })} />
            <Button title="Delete" color="#d9534f" onPress={() => handleDeletePress(taskDetails)} />
          </View>
          <Button title="Save" onPress={handleSave} />
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
  titleContainer: {
    flexDirection: 'row',
  },
  title: {
    color: '#000',
    fontSize: 22,
    fontWeight: '700',
    marginLeft: 5,
    marginBottom: 15,
  },
  completedTaskTitle: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
  },
  detail: {
    fontSize: 16,
    margin: 3,
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  leftButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 120,
  },
  textBox: {
    margin: 5,
    borderWidth: 1,
    borderColor: 'gray',
    padding: 7,
    height: 200,
    width: '100%',
    borderRadius: 10,
    fontSize: 15,
  },
  messageContainer: {
    alignItems: 'center',
  },
  savedMessage: {
    fontSize: 16,
    color: 'green',
  },
  unsavedMessage: {
    fontSize: 16,
    color: 'red',
  },
});

export default TaskDetailsScreen;
