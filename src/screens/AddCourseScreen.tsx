import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

import { ClassPeriod, Course } from '../types';
import FormTemplate from '../components/FormTemplate';
import { getAllCourses, storeCourse } from '../storage/CoursesStorage';
import { DatePickerMode } from '../components/FormTemplate';

interface AddCourseScreenProps {
  navigation: any,
}
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const AddCourseScreen: React.FC<AddCourseScreenProps> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [credits, setCredits] = useState('');
  const [location, setLocation] = useState('');
  const [day, setDay] = useState('Monday');
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  const fields = [
    {
      label: 'Course Name',
      placeholder: 'Enter course name',
      value: name,
      onChangeText: setName,
    },
    {
      label: 'Course Code',
      placeholder: 'Enter course code',
      value: code,
      onChangeText: setCode,
    },
    {
      label: 'Credits',
      placeholder: 'Enter number of credits',
      value: credits,
      onChangeText: setCredits,
    },
    {
      label: 'Location',
      placeholder: 'Enter course location',
      value: location,
      onChangeText: setLocation,
    },
    {
      label: 'Day',
      placeholder: 'Select day',
      value: day,
      isPicker: true,
      pickerItems: DAYS,
      onChangeText: setDay,
    },
    {
      label: 'Start Time',
      value: startTime,
      isDatePicker: true,
      onDateChange: setStartTime,
      datePickerMode: 'time' as DatePickerMode,
    },
    {
      label: 'End Time',
      value: endTime,
      isDatePicker: true,
      onDateChange: setEndTime,
      datePickerMode: 'time' as DatePickerMode,
    },
  ];

  const isCourseOverlapped = (newCourse: Course, existingCourses: Course[]): boolean => {
    for (let existingCourse of existingCourses) {
      const courseDuration = existingCourse.schedule[0];
      const newCourseStartTime = moment(newCourse.schedule[0].startTime).format('HH:mm');
      const newCourseEndTime = moment(newCourse.schedule[0].endTime).format('HH:mm');
      const existingCourseStartTime = moment(courseDuration.startTime).format('HH:mm');
      const existingCourseEndTime = moment(courseDuration.endTime).format('HH:mm');

      if (courseDuration.day === newCourse.schedule[0].day
        && ((newCourseStartTime >= existingCourseStartTime && newCourseStartTime < existingCourseEndTime)
        || (newCourseEndTime > existingCourseStartTime && newCourseEndTime <= existingCourseEndTime))) {
        return true;
      }
    }
    return false;
  };

  const resetState = () => {
    setName('');
    setCode('');
    setCredits('');
    setLocation('');
  };

  const handleSubmit = async () => {
    if (!name || name.length > 100) {
      Alert.alert('Invalid input', 'Please enter a valid course name (1-100 characters).');
      return;
    }

    if (!code || code.length > 100) {
      Alert.alert('Invalid input', 'Please enter a valid course code (1-100 characters).');
      return;
    }

    const numCredits = parseInt(credits, 10);
    if (isNaN(numCredits) || numCredits <= 0) {
      Alert.alert('Invalid input', 'Please enter a valid number of credits (greater than 0).');
      return;
    }

    if (!location) {
      Alert.alert('Invalid input', 'Please enter a location.');
      return;
    }

    if (startTime >= endTime) {
      Alert.alert('Invalid input', 'Start time must be earlier than end time.');
      return;
    }

    const minTime = moment('7:30', 'HH:mm');
    const maxTime = moment('17:45', 'HH:mm');
    const startTimeMoment = moment(startTime);
    const endTimeMoment = moment(endTime);

    if (startTimeMoment.format('HH:mm') < minTime.format('HH:mm') || startTimeMoment.format('HH:mm') > maxTime.format('HH:mm')) {
      Alert.alert('Invalid input', 'Start time must be between 7:30 and 17:45');
      return;
    }

    if (endTimeMoment.format('HH:mm') < minTime.format('HH:mm') || endTimeMoment.format('HH:mm') > maxTime.format('HH:mm')) {
      Alert.alert('Invalid input', 'End time must be between 7:30 and 17:45');
      return;
    }

    const newCourse: Course = {
      id: uuidv4(),
      name,
      code,
      credits: parseInt(credits, 10),
      location,
      schedule: [{ day, startTime, endTime } as ClassPeriod],
    };

    const existingCourses = await getAllCourses() || [];
    if (isCourseOverlapped(newCourse, existingCourses)) {
      Alert.alert('Invalid input', 'This course overlaps with another course.');
      return;
    }

    await storeCourse(newCourse);

    resetState();

    Alert.alert(
      'Success',
      'Course was added successfully',
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

export default AddCourseScreen;
