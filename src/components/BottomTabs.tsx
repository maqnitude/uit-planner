import React from 'react';
import { ComponentType } from 'react';
import { createBottomTabNavigator, BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import CoursesScreen from '../screens/CoursesScreen';
import TimeTable from '../screens/TimetableScreen';
import DevMenuScreen from '../screens/DevMenuScreen';

const Tab = createBottomTabNavigator();

interface TabScreenProps {
  name: string,
  component: ComponentType<any>;
  options: BottomTabNavigationOptions;
}

const screens: TabScreenProps[] = [
  {
    name: 'Courses',
    component: CoursesScreen,
    options: {
      tabBarIcon: ({ color, size }) => (
        <Icon name="google-classroom" color={color} size={size} />
      ),
    },
  },
  {
    name: 'Timetable',
    component: TimeTable,
    options: {
      tabBarIcon: ({ color, size }) => (
        <Icon name="timetable" color={color} size={size} />
      ),
    },
  },
];

const devScreens: TabScreenProps[] = [
  {
    name: 'Dev Menu',
    component: DevMenuScreen,
    options: {},
  },
];

function BottomTabs() {
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
        <Tab.Screen
          key={screen.name}
          name={screen.name}
          component={screen.component}
          options={screen.options}
        />
      ))}
      {__DEV__ && devScreens.map((screen) => (
        <Tab.Screen
          key={screen.name}
          name={screen.name}
          component={screen.component}
          options={screen.options}
        />
      ))}
    </Tab.Navigator>
  );
}

export default BottomTabs;
