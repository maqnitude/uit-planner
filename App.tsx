import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import CoursesScreen from './src/screens/CoursesScreen';
import AddCourseScreen from './src/screens/AddCourseScreen';

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
        <Stack.Screen name="Courses" component={CoursesScreen} />
        <Stack.Screen name="Add Course" component={AddCourseScreen} />
        {/* Other screens */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
