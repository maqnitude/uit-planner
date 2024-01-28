import React, { useState } from 'react';
import { Alert, View, Text, StyleSheet, Button, ScrollView, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import moment from 'moment';

import { getSemester, removeSemester } from '../../storage/SemestersStorage';
import { getCoursesBySemester } from '../../storage/CoursesStorage';
import { Semester, Course } from '../../types';

interface SemesterDetailsScreenProps {
  navigation: any;
  route: any;
}

const SemesterDetailsScreen: React.FC<SemesterDetailsScreenProps> = ({ navigation, route }) => {
  const { item: semester } = route.params;
  const [semesterDetails, setSemesterDetails] = useState(semester);
  const [courses, setCourses] = useState<Course[] | undefined>([]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchUpdatedSemesterAndCourses = async () => {
        const updatedSemester = await getSemester(semester.id);
        const semesterCourses = await getCoursesBySemester(semester.id);
        setSemesterDetails(updatedSemester);
        setCourses(semesterCourses);
      };
      fetchUpdatedSemesterAndCourses();
    }, [semester.id])
  );

  const handleDeletePress = async (item: Semester) => {
    Alert.alert(
      'Delete Semester',
      'Are you sure to delete this semester?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            await removeSemester(item.id);
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Semester: {semesterDetails.name}</Text>
        <Text style={styles.detail}>Total credits: {courses?.reduce((sum, course) => sum + course.credits, 0)}</Text>
        <Text style={styles.detail}>Start: {moment(semesterDetails.start).format('DD-MM-YYYY')}</Text>
        <Text style={styles.detail}>End: {moment(semesterDetails.end).format('DD-MM-YYYY')}</Text>
        <View style={styles.coursesContainer}>
          <ScrollView>
            {courses?.map((course, index) => (
              <TouchableOpacity key={index} style={styles.courseBlock} onPress={() => navigation.navigate('Course Details', { item: course })}>
                <Text style={styles.boldText}>{course.name} ({course.code})</Text>
                <Text>Location: {course.location}</Text>
                <Text>Time: {course.schedule[0].day}, {moment(course.schedule[0].startTime).format('HH:mm:ss')}-{moment(course.schedule[0].endTime).format('HH:mm:ss')}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <View style={styles.buttonContainer}>
          <Button title="Edit" onPress={() => navigation.navigate('Edit Semester', { semester: semesterDetails })} />
          <Button title="Delete" color="#d9534f" onPress={() => handleDeletePress(semesterDetails)} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom : 50,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detail: {
    fontSize: 18,
    marginBottom: 10,
  },
  coursesContainer: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  courseBlock: {
    marginVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    borderStyle: 'dashed',
  },
  buttonContainer: {
    marginVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonWrapper: {
    width: '40%',
  },
  boldText: {
    fontWeight: 'bold',
  },
});

export default SemesterDetailsScreen;
