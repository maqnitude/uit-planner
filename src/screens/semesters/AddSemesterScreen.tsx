import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

import { Semester } from '../../types';
import FormTemplate from '../../components/FormTemplate';
import { getAllSemesters, storeSemester } from '../../storage/SemestersStorage';
import { DatePickerMode } from '../../components/FormTemplate';

interface AddSemesterScreenProps {
  navigation: any,
}

const AddSemesterScreen: React.FC<AddSemesterScreenProps> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date());

  const fields = [
    {
      label: 'Semester Name',
      placeholder: 'Enter semester name',
      value: name,
      onChangeText: setName,
    },
    {
      label: 'Start',
      value: start,
      isDatePicker: true,
      onDateChange: setStart,
      datePickerMode: 'date' as DatePickerMode,
    },
    {
      label: 'End',
      value: end,
      isDatePicker: true,
      onDateChange: setEnd,
      datePickerMode: 'date' as DatePickerMode,
    },
  ];

  const isSemesterOverlapped = (newSemester: Semester, existingSemesters: Semester[]): boolean => {
    for (let existingSemester of existingSemesters) {
      const SemesterDuration = existingSemester;
      const newSemesterStartTime = moment(newSemester.start).format('YYYY:MM:DD');
      const newSemesterEndTime = moment(newSemester.end).format('YYYY:MM:DD');
      const existingSemesterStartTime = moment(SemesterDuration.start).format('YYYY:MM:DD');
      const existingSemesterEndTime = moment(SemesterDuration.end).format('YYYY:MM:DD');

      if ((newSemesterStartTime >= existingSemesterStartTime && newSemesterStartTime < existingSemesterEndTime) ||
        (newSemesterEndTime > existingSemesterStartTime && newSemesterEndTime <= existingSemesterEndTime) ||
        (newSemesterStartTime <= existingSemesterStartTime && newSemesterEndTime >= existingSemesterEndTime)) {
        return true;
      }
    }
    return false;
  };

  const resetState = () => {
    setName('');
  };

  const handleSubmit = async () => {
    if (!name.trim() || name.length > 100) {
      Alert.alert('Invalid input', 'Please enter a valid semester name (1-100 non-whitespace characters).');
      return;
    }

    if (!(end > start)) {
      Alert.alert('Invalid input', 'The end date must be later than the start date');
      return;
    }

    if (moment(start).isBefore(moment()) || moment(end).isBefore(moment())) {
      Alert.alert('Invalid input', 'The semester start and end dates must be in the future.');
      return;
    }

    const newSemester: Semester = {
      id: uuidv4(),
      name,
      start,
      end,
    };

    const existingSemesters = await getAllSemesters() || [];
    if (isSemesterOverlapped(newSemester, existingSemesters)) {
      Alert.alert('Invalid input', 'This semester overlaps with another semester.');
      return;
    }

    await storeSemester(newSemester);

    resetState();

    Alert.alert(
      'Success',
      'Semester was added successfully',
      [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]
    );
  };

  return (
    <View>
      <FormTemplate fields={fields} onSubmit={handleSubmit} />
    </View>
  );
};

export default AddSemesterScreen;
