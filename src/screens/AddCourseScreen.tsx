import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import FormTemplate from '../components/FormTemplate';
import { Course } from '../types';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { addInstance } from '../storage/Storage';

const AddCourseScreen = ({ route }) => {
  const { setCourses } = route.params;
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [credits, setCredits] = useState('');
  const [location, setLocation] = useState('');

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

    const newCourse: Course = {
      id: uuidv4(),
      name,
      code,
      credits: parseInt(credits, 10),
      location,
    };

    await addInstance('course', newCourse);

    setCourses((prevCourses: Course[]) => [...prevCourses, newCourse]);

    resetState();
  };

  return (
    <View>
      <FormTemplate fields={fields} onSubmit={handleSubmit} />
    </View>
  );
};

export default AddCourseScreen;
