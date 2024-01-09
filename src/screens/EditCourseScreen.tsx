import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import 'react-native-get-random-values';

import { ClassPeriod, Course } from '../types';
import { updateCourse } from '../storage/CoursesStorage';
import FormTemplate from '../components/FormTemplate';

const EditCourseScreen = ({ route, navigation }) => {
  const { course, setCourses } = route.params;
  const [name, setName] = useState(course.name);
  const [code, setCode] = useState(course.code);
  const [credits, setCredits] = useState(course.credits.toString());
  const [location, setLocation] = useState(course.location);
  const [day, setDay] = useState(course.schedule[0].day);
  const [startTime, setStartTime] = useState(new Date(course.schedule[0].startTime));
  const [endTime, setEndTime] = useState(new Date(course.schedule[0].endTime));

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
      pickerItems: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      onChangeText: setDay,
    },
    {
      label: 'Start Time',
      value: startTime,
      isDatePicker: true,
      onDateChange: setStartTime,
    },
    {
      label: 'End Time',
      value: endTime,
      isDatePicker: true,
      onDateChange: setEndTime,
    },
  ];

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

    const updatedCourse: Course = {
      ...course,
      name,
      code,
      credits: parseInt(credits, 10),
      location,
      schedule: [{ day, startTime, endTime } as ClassPeriod],
    };

    await updateCourse(updatedCourse);

    setCourses((prevCourses: Course[]) => prevCourses.map((c: Course) => c.id === course.id ? updatedCourse : c));

    resetState();

    Alert.alert(
      'Success',
      'Course was updated successfully',
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

export default EditCourseScreen;
