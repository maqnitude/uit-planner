import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

import { Semester } from '../types';
import FormTemplate from '../components/FormTemplate';
import { getAllSemesters, storeSemester } from '../storage/SemestersStorage';
import { DatePickerMode } from '../components/FormTemplate';

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
      const newSemesterStartTime = moment(newSemester.start).format('MM:DD:YYYY');
      const newSemesterEndTime = moment(newSemester.end).format('MM:DD:YYYY');
      const existingSemesterStartTime = moment(SemesterDuration.start).format('MM:DD:YYYY');
      const existingSemesterEndTime = moment(SemesterDuration.end).format('MM:DD:YYYY');

      if (((newSemesterStartTime >= existingSemesterStartTime && newSemesterStartTime < existingSemesterEndTime)
        || (newSemesterEndTime > existingSemesterStartTime && newSemesterEndTime <= existingSemesterEndTime))) {
        return true;
      }
    }
    return false;
  };

  const resetState = () => {
    setName('');
  };

  const handleSubmit = async () => {
    if (!name || name.length > 100) {
      Alert.alert('Invalid input', 'Please enter a valid semester name (1-100 characters).');
      return;
    }

    if (start >= end) {
      Alert.alert('Invalid input', 'Start time must be earlier than end time.');
      return;
    }

    const startTimeMoment = moment(start);
    const endTimeMoment = moment(end);

    const startYear = startTimeMoment.year();
    const endYear = endTimeMoment.year();

    if (startYear < 2013 || endYear < 2013) {
      Alert.alert('Invalid input', 'Start and end year must be greater than or equal to 2013');
      return;
    }

    const monthDifference = endTimeMoment.month() - startTimeMoment.month();
    if (monthDifference > 6) {
      Alert.alert('Invalid input', 'Month difference must be at most 6 months');
      return;
    }

    const yearDifference = endYear - startYear;
    if (yearDifference > 1) {
      Alert.alert('Invalid input', 'Year difference must be at most 1 year');
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
