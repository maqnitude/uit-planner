import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import FormTemplate from '../components/FormTemplate';

// we can reuse this interface from CoursesScreen
interface Course {
  name: string;
  code: string;
  credits: number;
}

const AddCourseScreen = ({ route }) => {
  const { setCourses } = route.params;
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [credits, setCredits] = useState('');

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
    // add more fields
  ];

  const handleSubmit = () => {
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
    // add more code to validate the form here

    const newCourse: Course = { name, code, credits: parseInt(credits, 10) };
    setCourses((prevCourses: Course[]) => [...prevCourses, newCourse]);

    setName('');
    setCode('');
    setCredits('');
  };

  return (
    <View>
      <FormTemplate fields={fields} onSubmit={handleSubmit} />
    </View>
  );
};

export default AddCourseScreen;
