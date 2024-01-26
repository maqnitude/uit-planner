import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import notifee, { AndroidImportance } from '@notifee/react-native';

import CoursesScreen from './src/screens/courses/CoursesScreen';
import AddCourseScreen from './src/screens/courses/AddCourseScreen';
import EditCourseScreen from './src/screens/courses/EditCourseScreen';
import CourseDetailsScreen from './src/screens/courses/CourseDetailsScreen';
import TimeTable from './src/screens/TimetableScreen';
import DevMenuScreen from './src/screens/DevMenuScreen';
import TasksScreen from './src/screens/tasks/TasksScreen';
import AddTaskScreen from './src/screens/tasks/AddTaskScreen';
import EditTaskScreen from './src/screens/tasks/EditTaskScreen';
import BottomTabs from './src/components/BottomTabs';
import TaskDetailsScreen from './src/screens/tasks/TaskDetailsScreen';
import HomeScreen from './src/screens/HomeScreen';
import SemesterScreen from './src/screens/semesters/SemestersScreen';
import AddSemesterScreen from './src/screens/semesters/AddSemesterScreen';
import SemesterDetailsScreen from './src/screens/semesters/SemesterDetailsScreen';
import EditSemesterScreen from './src/screens/semesters/EditSemesterScreen';
import { CurrentSemesterProvider } from './src/hooks/CurrentSemesterContext';

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    notifee.createChannel({
      id: 'task-channel',
      name: 'Task Notifications',
      importance: AndroidImportance.HIGH,
    });
  }, []);

  return (
    <CurrentSemesterProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: '#1e90ff',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            headerTitleAlign: 'center',
          }}>
          <Stack.Screen
            name="Bottom Tabs"
            component={BottomTabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Semesters" component={SemesterScreen} />
          <Stack.Screen name="Add Semester" component={AddSemesterScreen} />
          <Stack.Screen name="Semester Details" component={SemesterDetailsScreen} />
          <Stack.Screen name="Edit Semester" component={EditSemesterScreen} />
          <Stack.Screen name="Courses" component={CoursesScreen} />
          <Stack.Screen name="Add Course" component={AddCourseScreen} />
          <Stack.Screen name="Course Details" component={CourseDetailsScreen} />
          <Stack.Screen name="Edit Course" component={EditCourseScreen} />
          <Stack.Screen name="Timetable" component={TimeTable} />
          <Stack.Screen name="Tasks" component={TasksScreen} />
          <Stack.Screen name="Add Task" component={AddTaskScreen} />
          <Stack.Screen name="Task Details" component={TaskDetailsScreen} />
          <Stack.Screen name="Edit Task" component={EditTaskScreen} />
          {__DEV__ && (
            <Stack.Screen name="Dev Menu" component={DevMenuScreen} />
          )}
          {/* Other screens */}
        </Stack.Navigator>
      </NavigationContainer>
    </CurrentSemesterProvider>
  );
}
