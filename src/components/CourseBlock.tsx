import React from 'react';
import { View, Text } from 'react-native';

const CourseBlock = ({ course, color }) => {
  return (
    <View style={{ padding: 5, backgroundColor: color, height: 150, position: 'absolute', width: '100%' }}>
      <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{course.name}</Text>
      <Text style={{ fontSize: 12, fontWeight: '300' }}>{course.code}</Text>
      <Text style={{ fontSize: 13 }}>{course.location}</Text>
    </View>
  );
};

export default CourseBlock;
