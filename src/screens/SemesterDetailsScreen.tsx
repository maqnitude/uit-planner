import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, ScrollView } from 'react-native';
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
      <Text style={styles.title}>{semesterDetails.name}</Text>
      <Text style={styles.title}>Start Time: {moment(semesterDetails.start).format('MM-DD-YYYY')}</Text>
      <Text style={styles.title}>End Time: {moment(semesterDetails.end).format('MM-DD-YYYY')}</Text>
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
    marginBottom: 20,
  },
  detail: {
    fontSize: 18,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default SemesterDetailsScreen;
