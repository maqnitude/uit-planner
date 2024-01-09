import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { Course } from '../types';

interface CourseDetailsScreenProps {
  navigation: any;
  route: any;
}

const CourseDetailsScreen: React.FC<CourseDetailsScreenProps> = ({ navigation, route }) => {
  const { item: course, setCourses } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{course.name}</Text>
      <Text style={styles.detail}>Code: {course.code}</Text>
      <Text style={styles.detail}>Credits: {course.credits}</Text>
      <Text style={styles.detail}>Location: {course.location}</Text>
      <TouchableOpacity onPress={() => navigation.navigate('Edit Course', { course, setCourses })}>
        <Text>Edit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  detail: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default CourseDetailsScreen;
