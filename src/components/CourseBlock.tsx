import React from 'react';
import { View, Text } from 'react-native';

const CourseBlock = ({ course, color }) => {
  return (
    <View style={{ flex: 1, margin: 5, padding: 10, backgroundColor: color, justifyContent: 'center' }}>
      <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{course.name}</Text>
      <Text style={{ fontSize: 14, fontWeight: '300' }}>{course.code}</Text>
    </View>
  );
};

export default CourseBlock;
