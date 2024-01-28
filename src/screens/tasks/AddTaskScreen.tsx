import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

import { Task } from '../../types';
import FormTemplate from '../../components/FormTemplate';
import { createTask } from '../../utils/TaskManager';
import { DatePickerMode } from '../../components/FormTemplate';

interface AddTaskScreenProps {
  route: any,
  navigation: any,
}

const AddTaskScreen: React.FC<AddTaskScreenProps> = ({ route, navigation }) => {
  const { course } = route.params;
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [description, setDescription] = useState('');

  const fields = [
    {
      label: 'Task Title',
      placeholder: 'Enter task title',
      value: name,
      onChangeText: setName,
    },
    {
      label: 'Task Type',
      placeholder: 'Enter task label',
      value: type,
      onChangeText: setType,
    },
    {
      label: 'Due day',
      value: dueDate,
      isDatePicker: true,
      datePickerMode: 'datetime' as DatePickerMode,
      onDateChange: setDueDate,
    },
    {
      label: 'Description',
      placeholder: 'Enter task description',
      value: description,
      onChangeText: setDescription,
    },
  ];

  const resetState = () => {
    setName('');
    setType('');
    setDescription('');
  };

  const handleSubmit = async () => {
    if (!name || name.length > 100) {
      Alert.alert('Invalid input', 'Please enter a valid task title (1-100 characters).');
      return;
    }

    if (!type || type.length > 30) {
      Alert.alert('Invalid input', 'Please enter a valid task type (1-30 characters).');
      return;
    }

    if (!moment(dueDate).isAfter(moment())) {
      Alert.alert('Invalid input', 'Due date should be later than the current time.');
      return;
    }

    const newTask: Task = {
      id: uuidv4(),
      courseId: course.id,
      name,
      type,
      dueDate,
      description,
      completed: false,
    };

    // await storeTask(newTask);
    await createTask(newTask);

    resetState();

    setTimeout(() => {
      Alert.alert(
        'Success',
        'Task was added successfully',
        [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]
      );
    }, 30); // delay of 30ms
  };

  return (
    <View>
      <FormTemplate fields={fields} onSubmit={handleSubmit} />
    </View>
  );
};

export default AddTaskScreen;
