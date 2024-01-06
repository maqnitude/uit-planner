import React from 'react';
import { View, Text } from 'react-native';

const CourseBlock = ({ course, color }) => {
  return (
    <View style={{ flex: 1, padding: 10, backgroundColor: color }}>
      <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{course.name}</Text>
      <Text style={{ fontSize: 14, fontWeight: '300' }}>{course.code}</Text>
      <Text style={{ fontSize: 14 }}>{course.location}</Text>
    </View>
  );
};

export default CourseBlock;
