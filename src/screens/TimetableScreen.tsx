import React from 'react';
import { ScrollView, View, Text, Dimensions } from 'react-native';
import CourseBlock from '../components/CourseBlock';

const TimeTable = () => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const times = ['7:30', '8:15', '9:00', '9:45', '10:45', '11:30', '13:00', '13:45', '14:30', '15:15', '16:15', '17:00'];
  const dayColors = {
    'Monday': '#CBE4F9',
    'Tuesday': '#CDF5F6',
    'Wednesday': '#EFF9DA',
    'Thursday': '#F9EBDF',
    'Friday': 'F9D8D6',
    'Saturday': '#D6CDEA',
  };
  // create a list of dummy courses
  const courses = [
    {
      name: "Machine Learning",
      code: 'CS114',
      credits: 4,
      location: 'B1.02',
      time: '7:30',
      day: 'Monday',
    },
    {
      name: "Computational Thinking",
      code: 'CS117',
      credits: 3,
      location: 'B2.02',
      time: '13:00',
      day: 'Thursday',
    },
    {
      name: "Algebra",
      code: 'MA003',
      credits: 4,
      location: 'C4.02',
      time: '10:30',
      day: 'Wednesday',
    },
    {
      name: "Homographic",
      code: 'HS003',
      credits: 3,
      location: 'C4.08',
      time: '9:45',
      day: "Saturday",
    },
    {
      name: "AblacaAblacaAblacaAblacaAblacaAblacaAblacaAblacaAblacaAblacaAblacaAblacaAblaca",
      code: 'HS003',
      credits: 3,
      location: 'C4.0888888888888888888888888888888888888888',
      time: '9:45',
      day: "Wednesday",
    },
  ];

  const screenWidth = Dimensions.get('window').width;

  const timeStampWidth = 50;
  const headerHeight = 30;
  const blockHeight = 100;

  return (
    <View style={{ flex: 1, flexDirection: 'row' }}>
      <ScrollView>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ marginBottom: blockHeight, marginTop: headerHeight }}>
            {times.map((time, index) => (
              <View key={index} style={{ width: timeStampWidth, height: blockHeight, justifyContent: 'flex-start', borderBottomWidth: 0.5, borderTopWidth: index === 0 ? 0.5 : 0 }}>
                <Text style={{ fontWeight: 'bold' }}>{time}</Text>
              </View>
            ))}
          </View>
          <ScrollView horizontal>
            <View style={{ flexDirection: 'row' }}>
              {days.map((day, index) => (
                <View key={index} style={{ width: (screenWidth - timeStampWidth) / 3 }}>
                  <Text style={{ fontWeight: 'bold', height: headerHeight, textAlign: 'center', backgroundColor: '#b5e2ff', borderLeftWidth: 0.5, borderBottomWidth: 0.5 }}>{day}</Text>
                  {times.map((time, index) => (
                    <View key={index} style={{ height: blockHeight, borderLeftWidth: 0.5, borderBottomWidth: 0.5 }}>
                      {courses.map((course, index) => (
                        course.time === time && course.day === day && <CourseBlock key={index} course={course} color={dayColors[day]} />
                      ))}
                    </View>
                  ))}
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
};

export default TimeTable;
