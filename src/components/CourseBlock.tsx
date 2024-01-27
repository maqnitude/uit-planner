import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import moment from 'moment';

import { Course } from '../types';

type CourseBlockProps = {
  course: Course;
  color?: string;
  height?: number;
  offset?: number;
}

const CourseBlock: React.FC<CourseBlockProps> = ({ course, color = '#e3e3e3', height = 90, offset = 0 }) => {
  return (
    <View style={[styles.block, {backgroundColor: color, height: height, marginTop: offset}]}>
      <Text style={styles.courseName}>{course.name}</Text>
      <Text style={styles.courseCode}>{course.code}</Text>
      <Text style={styles.courseLocation}>Loc: {course.location}</Text>
      <Text style={styles.courseTime}>{moment(course.schedule[0].startTime).format('HH:mm')} - {moment(course.schedule[0].endTime).format('HH:mm')}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  block: {
    padding: 5,
    position: 'absolute',
    width: '100%',
    borderRadius: 10,
    elevation: 4,
  },
  courseName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1e90ff',
  },
  courseCode: {
    fontSize: 12,
    fontWeight: '500',
  },
  courseLocation: {
    fontSize: 11,
  },
  courseTime: {
    fontSize: 11,
  },
});

export default CourseBlock;
