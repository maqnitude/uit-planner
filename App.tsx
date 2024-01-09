import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import CoursesScreen from './src/screens/CoursesScreen';
import AddCourseScreen from './src/screens/AddCourseScreen';
import EditCourseScreen from './src/screens/EditCourseScreen';
import CourseDetailsScreen from './src/screens/CourseDetailsScreen';
import TimeTable from './src/screens/TimetableScreen';

import BottomTabs from './src/components/BottomTabs';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
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
        <Stack.Screen name="Courses" component={CoursesScreen} />
        <Stack.Screen name="Add Course" component={AddCourseScreen} />
        <Stack.Screen name="Course Details" component={CourseDetailsScreen} />
        <Stack.Screen name="Edit Course" component={EditCourseScreen} />
        <Stack.Screen name="Timetable" component={TimeTable} />
        {/* Other screens */}
      </Stack.Navigator>
      </NavigationContainer>
  );
}
