import React, { useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { getCourse } from '../storage/CoursesStorage';

interface CourseDetailsScreenProps {
  navigation: any;
  route: any;
}

const CourseDetailsScreen: React.FC<CourseDetailsScreenProps> = ({ navigation, route }) => {
  const { item: course, setCourses } = route.params;
  const [courseDetails, setCourseDetails] = useState(course);

  useFocusEffect(
    React.useCallback(() => {
      const fetchUpdatedCourse = async () => {
        const updatedCourse = await getCourse(course.id);
        setCourseDetails(updatedCourse);
      };
      fetchUpdatedCourse();
    }, [course.id])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{courseDetails.name}</Text>
      <Text style={styles.detail}>Code: {courseDetails.code}</Text>
      <Text style={styles.detail}>Credits: {courseDetails.credits}</Text>
      <Text style={styles.detail}>Location: {courseDetails.location}</Text>
      <Button title="Edit" onPress={() => navigation.navigate('Edit Course', { course: courseDetails, setCourses })} />
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
