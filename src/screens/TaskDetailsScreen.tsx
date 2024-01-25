import React, { useState } from 'react';
import { ScrollView, Alert, Button, View, Text, StyleSheet, TextInput } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { useFocusEffect } from '@react-navigation/native';

import { getTask, updateTask } from '../storage/TasksStorage';
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
  const [text, setText] = useState(taskDetails.description)
  const [savedMessage, setSavedMessage] = useState('');
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
  const handleChangeDescription = async (item: Task, text: string) => {
    const updatedTask = { ...item, description: text };
    await updateTask(updatedTask);
    setTaskDetails(updatedTask);
    setSavedMessage('Saved ');
  };
  const handleInputChange = (text: string) => {
    // Lưu giá trị input vào state
    setText(text);
    setSavedMessage('Unsaved !');
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
    <ScrollView style={{ flex: 1 }}>
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
          onChangeText={(inputText) => handleInputChange(inputText)}
          value={text}
          multiline={true}
        />
        <View style={styles.messageContainer}>
          {savedMessage == 'Saved ' ? (
            <Text style={styles.savedMessage}>{savedMessage}</Text>
          ) : (
            savedMessage == 'Unsaved !' ? (
              <Text style={styles.UnsavedMessage}>{savedMessage}</Text>
            ) : (
              <Text style={styles.savedMessage}> </Text>
            )
          )}
        </View>
        <View style={styles.buttonContainer}>
          <View style={styles.buttonWrapper}>
            <Button title="Delete" color="#d9534f" onPress={() => handleDeletePress(taskDetails)} />
          </View>
          <View style={styles.buttonWrapper}>
            <Button title="Save" onPress={() => handleChangeDescription(taskDetails, text)} />
          </View>
        </View>

      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
  buttonWrapper: {

    width: 100,
  },

  textBox: {
    margin: 5,
    borderWidth: 1,
    borderColor: 'gray',
    padding: 7,
    height: 200,
    width: '100%',
    borderRadius: 10,
    fontSize: 17,
    fontWeight: 'bold',
  },
  messageContainer: {
    alignItems: 'center',
  },
  savedMessage: {

    fontSize: 17,
    color: 'green'
  },
  UnsavedMessage: {
    fontSize: 17,
    color: 'red',
  }
});

export default TaskDetailsScreen;
