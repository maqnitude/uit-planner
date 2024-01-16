import React, { useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { getSemester } from '../storage/SemestersStorage';
import moment from 'moment';

interface SemesterDetailsScreenProps {
  navigation: any;
  route: any;
}

const SemesterDetailsScreen: React.FC<SemesterDetailsScreenProps> = ({ navigation, route }) => {
  const { item: semester } = route.params;
  const [semesterDetails, setSemesterDetails] = useState(semester);

  useFocusEffect(
    React.useCallback(() => {
      const fetchUpdatedSemester = async () => {
        const updatedSemester = await getSemester(semester.id);
        setSemesterDetails(updatedSemester);
      };
      fetchUpdatedSemester();
    }, [semester.id])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Semester: {semesterDetails.name}</Text>
      <Text>Start: {moment(semesterDetails.start).format('DD-MM-YYYY')}</Text>
      <Text>End: {moment(semesterDetails.end).format('DD-MM-YYYY')}</Text>
      <View style={styles.buttonContainer}>
        <Button title="Edit" onPress={() => navigation.navigate('Edit Semester', { semester: semesterDetails })} />
      </View>
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
    marginBottom: 10,
  },
  detail: {
    fontSize: 18,
    marginBottom: 10,
  },
  buttonContainer: {
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default SemesterDetailsScreen;
