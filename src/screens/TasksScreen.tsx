import React, { useState } from 'react';
import { View, Text, SectionList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { useFocusEffect } from '@react-navigation/native';
import 'react-native-get-random-values';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';

import { Task } from '../types';
import { getAllTasks, updateTask } from '../storage/TasksStorage';
import { deleteTask } from '../utils/TaskManager';
import { useCurrentSemester } from '../hooks/CurrentSemesterContext';
import { getAllCourses } from '../storage/CoursesStorage';
import SearchBar from '../components/SearchBar';

interface TasksScreenProps {
  navigation: any;
}

interface Section {
  title: string;
  data: Task[];
}

const TasksScreen: React.FC<TasksScreenProps> = ({ navigation }) => {
  const [sections, setSections] = useState<Section[]>([]);
  const [filteredSections, setFilteredSections] = useState<Section[]>([]);
  const { currentSemesterId } = useCurrentSemester();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // get tasks by semester id
      const fetchedTasks = await getAllTasks();
      const courses = await getAllCourses();
      const currentSemesterCourses = courses?.filter(course => course.semesterId === currentSemesterId) ?? [];
      const currentSemesterTasks = fetchedTasks?.filter(task => currentSemesterCourses.some(course => course.id === task.courseId)) ?? [];

      // group tasks by course and sort within each course
      const groupedTasks = currentSemesterCourses.map(course => ({
        title: `${course.code} - ${course.name}`,
        data: currentSemesterTasks.filter(task => task.courseId === course.id).sort((a, b) => Number(a.completed) - Number(b.completed)),
      }));

      setSections(groupedTasks);
      setFilteredSections(groupedTasks);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, [currentSemesterId]);

  useFocusEffect(
    React.useCallback(() => {
      fetchTasks();
    }, [fetchTasks])
  );

  const handleSearch = (searchText: string) => {
    if (searchText) {
      const filtered = sections.map(section => ({
        ...section,
        data: section.data.filter(task => task.name.toLowerCase().includes(searchText.toLowerCase())),
      }));
      setFilteredSections(filtered);
    } else {
      setFilteredSections(sections);
    }
  };

  const handleItemPress = (item: Task) => {
    navigation.navigate('Task Details', { item });
  };

  const handleToggleComplete = async (item: Task, newValue: boolean) => {
    item.completed = newValue;
    await updateTask(item);

    setSections(sections.map(section => ({
      ...section,
      data: section.data.map(task => task.id === item.id ? { ...task, completed: newValue } : task),
    })).map(section => ({
      ...section,
      data: section.data.sort((a, b) => Number(a.completed) - Number(b.completed)),
    })));
  };

  const handleDeletePress = async (item: Task) => {
    Alert.alert(
      'Delete Task',
      'Are you sure to delete this task?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            await deleteTask(item);
            fetchTasks();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {isLoading && <Text>Loading tasks...</Text>}
      {error && <Text style={styles.errorText}>Error loading tasks: {error}</Text>}
      <SearchBar
        onSearch={handleSearch}
      />
      {!isLoading && !error && (
        <SectionList
          contentContainerStyle={styles.listContent}
          sections={filteredSections}
          renderItem={({ item }) => (
            <View style={[styles.itemBlock, item.completed ? styles.completedTaskBlock : {}]}>
              <View style={styles.checkboxContainer}>
                <CheckBox
                  value={item.completed}
                  onValueChange={(newValue) => handleToggleComplete(item, newValue)}
                />
                <TouchableOpacity style={styles.itemDetails} onPress={() => handleItemPress(item)}>
                  <View>
                    <Text style={[styles.itemTitle, item.completed ? styles.completedTaskTitle : {}]}>{item.name}</Text>
                    <Text style={[styles.itemStatus, item.completed ? styles.completedTaskStatus : {}]}>{item.completed ? 'DONE' : 'TODO'}</Text>
                    <Text style={[styles.itemDue, item.completed ? styles.completedTaskTitle : {}]}>Due: {moment(item.dueDate).format('HH:mm:ss DD/MM/YYYY')}</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={() => handleDeletePress(item)}>
                <Icon name="delete" size={25} />
              </TouchableOpacity>
            </View>
          )}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.header}>{title}</Text>
          )}
          keyExtractor={item => item.name}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorText: {
    color: 'red',
  },
  listContent: {
    paddingBottom: 70,
  },
  header: {
    color: '#003399',
    fontSize: 20,
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    marginTop: 20,
    marginHorizontal: 20,
    padding: 5,
  },
  itemBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 20,
    marginHorizontal: 20,
    padding: 5,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemDetails: {
    marginLeft: 7,
  },
  itemTitle: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
  },
  itemStatus: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'green',
    marginHorizontal: 2,
  },
  itemDue: {
    fontSize: 14,
    color: '#900d09',
    marginHorizontal: 2,
  },
  completedTaskBlock: {
    backgroundColor: '#b5b5b5',
  },
  completedTaskTitle: {
    color: 'black',
    textDecorationStyle: 'solid',
    textDecorationLine: 'line-through',
  },
  completedTaskStatus: {
    color: '#1a98a6',
  },
});

export default TasksScreen;
