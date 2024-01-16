import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from "react-native";
import { clearStorage, populateStorage } from "../storage/Storage";
import { getAllCourses } from "../storage/CoursesStorage";
import { getAllSemesters } from "../storage/SemestersStorage";
import { getAllTasks } from "../storage/TasksStorage";

interface DevMenuScreenProps {
  navigation: any;
}

const DevMenuScreen: React.FC<DevMenuScreenProps> = ({ navigation }) => {
  const [output, setOutput] = useState(<Text></Text>);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const refreshOutput = async () => {
      if (refresh) {
        await inspectDatabase();
        setRefresh(false);
      }
    };

    refreshOutput();
  }, [refresh]);

  const populateDatabase = async () => {
    Alert.alert(
      'Populate Database',
      'This action will first clear all the data currently in storage. Are you sure to continue?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            await clearStorage();
            await populateStorage();
            setRefresh(true);
          }
        }
      ]
    );
  };

  const inspectDatabase = async () => {
    const semesters = await getAllSemesters() || [];
    const courses = await getAllCourses() || [];
    const tasks = await getAllTasks() || [];

    const semestersDataSize = new Blob([JSON.stringify(semesters)]).size;
    const coursesDataSize = new Blob([JSON.stringify(courses)]).size;
    const tasksDataSize = new Blob([JSON.stringify(tasks)]).size;
    const totalDataSize = semestersDataSize + coursesDataSize + tasksDataSize;

    const numSemesters = semesters.length;
    const numCourses = courses.length;
    const numTasks = tasks.length;

    setOutput(
      <Text>
        <Text style={{ fontWeight: 'bold' }}>SUMMARY:</Text> {'\n'}
        <Text style={{ fontWeight: 'bold' }}>{'\t'} Number of semesters:</Text> {numSemesters}{'\n'}
        <Text style={{ fontWeight: 'bold' }}>{'\t'} Number of courses:</Text> {numCourses}{'\n'}
        <Text style={{ fontWeight: 'bold' }}>{'\t'} Number of tasks:</Text> {numTasks}{'\n'}
        <Text style={{ fontWeight: 'bold' }}>{'\t'} Total estimated size:</Text> {totalDataSize} B{'\n\n'}
        <Text style={{ fontWeight: 'bold' }}>Semesters Data ({semestersDataSize} B):</Text> {JSON.stringify(semesters, null, 2)}{'\n\n'}
        <Text style={{ fontWeight: 'bold' }}>Courses Data ({coursesDataSize} B):</Text> {JSON.stringify(courses, null, 2)}{'\n\n'}
        <Text style={{ fontWeight: 'bold' }}>Tasks Data ({tasksDataSize} B):</Text> {JSON.stringify(tasks, null, 2)}
      </Text>
    );
  };

  const clearDatabase = async () => {
    Alert.alert(
      'Clear Database',
      'Are you sure to clear all data in database?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            await clearStorage();
            setRefresh(true);
          }
        }
      ]
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity onPress={() => populateDatabase()}>
        <View style={styles.button}>
          <Text style={{ color: 'white' }}>Populate Database</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => inspectDatabase()}>
        <View style={styles.button}>
          <Text style={{ color: 'white' }}>Inspect Database</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => clearDatabase()}>
        <View style={styles.button}>
          <Text style={{ color: 'white' }}>Clear Database</Text>
        </View>
      </TouchableOpacity>
      <ScrollView style={{ flexGrow: 1, borderWidth: 2, margin: 20 }}>
        <Text style={{ color: 'black', fontSize: 12 }}>{output}</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1e90ff',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    marginTop: 20,
    marginHorizontal: 20,
    padding: 10,
  },
});

export default DevMenuScreen;
