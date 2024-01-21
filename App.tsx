import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import notifee, { AndroidImportance } from '@notifee/react-native';

import CoursesScreen from './src/screens/CoursesScreen';
import AddCourseScreen from './src/screens/AddCourseScreen';
import EditCourseScreen from './src/screens/EditCourseScreen';
import CourseDetailsScreen from './src/screens/CourseDetailsScreen';
import TimeTable from './src/screens/TimetableScreen';
import DevMenuScreen from './src/screens/DevMenuScreen';
import TasksScreen from './src/screens/TasksScreen';
import AddTaskScreen from './src/screens/AddTaskScreen';
import BottomTabs from './src/components/BottomTabs';
import TaskDetailsScreen from './src/screens/TaskDetailsScreen';
import HomeScreen from './src/screens/HomeScreen';
import SemesterScreen from './src/screens/SemestersScreen';
import AddSemesterScreen from './src/screens/AddSemesterScreen';
import SemesterDetailsScreen from './src/screens/SemesterDetailsScreen';
import EditSemesterScreen from './src/screens/EditSemesterScreen';
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
          {__DEV__ && (
            <Stack.Screen name="Dev Menu" component={DevMenuScreen} />
          )}
          {/* Other screens */}
        </Stack.Navigator>
      </NavigationContainer>
    </CurrentSemesterProvider>
  );
}
