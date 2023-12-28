import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import CoursesScreen from './src/screens/CoursesScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Courses" component={CoursesScreen} />
        {/* Other screens */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
