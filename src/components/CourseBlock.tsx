import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';

import { Course } from '../types';

type CourseBlockProps = {
  course: Course;
  color?: string;
  height?: number;
  offset?: number;
}

const CourseBlock: React.FC<CourseBlockProps> = ({ course, color = '#e3e3e3', height = 90, offset = 0 }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity style={[styles.block, { backgroundColor: color, height: height, marginTop: offset }]} onPress={() => navigation.navigate('Course Details', { item: course })}>
      <Text style={styles.courseName}>{course.name}</Text>
      <Text style={styles.courseCode}>{course.code}</Text>
      <Text style={styles.courseLocation}>Loc: {course.location}</Text>
      <Text style={styles.courseTime}>{moment(course.schedule[0].startTime).format('HH:mm')} - {moment(course.schedule[0].endTime).format('HH:mm')}</Text>
    </TouchableOpacity>
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
    fontSize: 14,
    fontWeight: '700',
  },
  courseCode: {
    fontSize: 13,
    fontWeight: '300',
  },
  courseLocation: {
    fontSize: 13,
  },
  courseTime: {
    fontSize: 13,
  },
});

export default CourseBlock;
