import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, Dimensions } from 'react-native';
import moment from 'moment';

import CourseBlock from '../components/CourseBlock';
import { Course } from '../types';
import { getAllCourses } from '../storage/CoursesStorage';

const TimeTable = () => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  let timeStamps = ['7:30', '8:15', '9:00', '9:45', '10:45', '11:30', '13:00', '13:45', '14:30', '15:15', '16:15', '17:00'];
  const times = timeStamps.map(time => moment(time, 'HH:mm'));
  const dayColors = {
    'Monday': '#CBE4F9',
    'Tuesday': '#CDF5F6',
    'Wednesday': '#EFF9DA',
    'Thursday': '#F9EBDF',
    'Friday': 'F9D8D6',
    'Saturday': '#D6CDEA',
  };

  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const fetchedCourses = await getAllCourses();
      setCourses(fetchedCourses ?? []);
    };
    fetchCourses();
  }, []);

  const screenWidth = Dimensions.get('window').width;
  const timeStampWidth = 45;
  const headerHeight = 30;
  const blockHeight = 100;

  return (
    <View style={{ flex: 1, flexDirection: 'row' }}>
      <ScrollView>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ marginBottom: blockHeight, marginTop: headerHeight }}>
            {timeStamps.map((time, index) => (
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
                  {times.map((time, index) => {
                    return <View key={index} style={{ height: blockHeight, borderLeftWidth: 0.5, borderBottomWidth: 0.5 }}>
                      {courses.map((course, index) => {
                        const courseStartTime = moment(course.schedule[0].startTime).format('HH:mm');
                        const formattedTime = time.format('HH:mm');
                        console.log(`${courseStartTime} and ${formattedTime}`);
                        return (
                          courseStartTime === formattedTime &&
                          course.schedule[0].day === day &&
                          <CourseBlock key={index} course={course} color={dayColors[day]} />
                        );
                      })}
                    </View>;
                  })}
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
