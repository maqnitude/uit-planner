import React from 'react';
import { ComponentType } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import CoursesScreen from '../screens/CoursesScreen';
import TimeTable from '../screens/TimetableScreen';

const Tab = createBottomTabNavigator();

interface TabScreen {
  name: string,
  component: ComponentType<any>;
}

function BottomTabs() {
  const screens: TabScreen[] = [
    { name: 'Courses', component: CoursesScreen },
    { name: 'Timetable', component: TimeTable },
  ];

  return (
    <Tab.Navigator
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
      {screens.map((screen) => (
        <Tab.Screen key={screen.name} name={screen.name} component={screen.component} />
      ))}
    </Tab.Navigator>
  );
}

export default BottomTabs;
