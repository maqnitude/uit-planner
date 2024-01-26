import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import moment from 'moment';

import { Task } from '../../types';
import FormTemplate from '../../components/FormTemplate';
import { DatePickerMode } from '../../components/FormTemplate';
import { editTask } from '../../utils/TaskManager';

interface EditTaskScreenProps {
  route: any,
  navigation: any,
}

const EditTaskScreen: React.FC<EditTaskScreenProps> = ({ route, navigation }) => {
  const { task } = route.params;
  const [name, setName] = useState(task.name);
  const [type, setType] = useState(task.type);
  const [dueDate, setDueDate] = useState(new Date(task.dueDate));

  const resetState = () => {
    setName('');
    setType('');
  };

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
  ];

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

    const updatedTask: Task = {
      ...task,
      name,
      type,
      dueDate,
    };

    await editTask(updatedTask);

    resetState();

    setTimeout(() => {
      Alert.alert(
        'Success',
        'Task was updated successfully',
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

export default EditTaskScreen;
