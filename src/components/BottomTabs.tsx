import React from 'react';
import { ComponentType } from 'react';
import { createBottomTabNavigator, BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FAIcon from 'react-native-vector-icons/FontAwesome5';

import CoursesScreen from '../screens/courses/CoursesScreen';
import TimeTable from '../screens/TimetableScreen';
import TasksScreen from '../screens/tasks/TasksScreen';
import DevMenuScreen from '../screens/DevMenuScreen';
import HomeScreen from '../screens/HomeScreen';
import SemesterScreen from '../screens/semesters/SemestersScreen';

const Tab = createBottomTabNavigator();

interface TabScreenProps {
  name: string,
  component: ComponentType<any>;
  options: BottomTabNavigationOptions;
}

const screens: TabScreenProps[] = [
  {
    name: 'Home',
    component: HomeScreen,
    options: {
      tabBarIcon: ({ color, size }) => (
        <MCIcon name="home" color={color} size={size} />
      ),
    },
  },
  {
    name: 'Semesters',
    component: SemesterScreen,
    options: {
      tabBarIcon: ({ color, size }) => (
        <MCIcon name="calendar-blank-multiple" color={color} size={size} />
      ),
    },
  },
  {
    name: 'Courses',
    component: CoursesScreen,
    options: {
      tabBarIcon: ({ color, size }) => (
        <MCIcon name="google-classroom" color={color} size={size} />
      ),
    },
  },
  {
    name: 'Tasks',
    component: TasksScreen,
    options: {
      tabBarIcon: ({ color, size }) => (
        <FAIcon name="tasks" color={color} size={size} />
      ),
    },
  },
  {
    name: 'Timetable',
    component: TimeTable,
    options: {
      tabBarIcon: ({ color, size }) => (
        <MCIcon name="timetable" color={color} size={size} />
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
