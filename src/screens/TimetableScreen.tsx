import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, Dimensions } from 'react-native';
import moment from 'moment';

import CourseBlock from '../components/CourseBlock';
import { Course } from '../types';
import { getAllCourses } from '../storage/CoursesStorage';

const TimeTable = () => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const timeStamps = ['7:30', '8:15', '9:00', '9:45', '10:30', '11:15', '12:00', '12:45', '13:00', '13:45', '14:30', '15:15', '16:15', '17:00'];
  const times = timeStamps.map(time => moment(time, 'HH:mm'));
  const dayColors = {
    'Monday': '#CBE4F9',
    'Tuesday': '#CDF5F6',
    'Wednesday': '#EFF9DA',
    'Thursday': '#F9EBDF',
    'Friday': '#F9D8D6',
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
  const timeStampWidth = 50;
  const headerHeight = 30;
  const unitHeight = 90;
  return (
    <View style={{ flex: 1, flexDirection: 'row' }}>
      <ScrollView>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ marginBottom: unitHeight, marginTop: headerHeight }}>
            {timeStamps.map((time, index) => (
              <View key={index} style={{ width: timeStampWidth, height: unitHeight, justifyContent: 'flex-start', alignItems: 'center', borderBottomWidth: 0.5, borderRightWidth: 0.5, borderTopWidth: index === 0 ? 0.5 : 0 }}>
                <Text style={{ fontWeight: 'bold' }}>{time}</Text>
              </View>
            ))}
          </View>
          <ScrollView horizontal>
            <View style={{ flexDirection: 'row' }}>
              {days.map((day, dayIndex) => (
                <View key={dayIndex} style={{ width: (screenWidth - timeStampWidth) / 3 }}>
                  <Text style={{ fontWeight: 'bold', height: headerHeight, textAlign: 'center', backgroundColor: '#b5e2ff', borderLeftWidth: 0.5, borderBottomWidth: 0.5 }}>{day}</Text>
                  {times.map((time, timeIndex) => {
                    return <View key={timeIndex} style={{ height: unitHeight, borderRightWidth: 0.5, borderBottomWidth: 0.5 }}>
                      {courses.map((course, courseIndex) => {
                        const courseStartTime = moment(course.schedule[0].startTime).format('HH:mm');
                        const courseEndTime = moment(course.schedule[0].endTime).format('HH:mm');
                        const timeSlotEnd = moment(time).add(45, 'minutes').format('HH:mm');
                        if (courseStartTime >= time.format('HH:mm') && courseStartTime < timeSlotEnd && course.schedule[0].day === day) {
                          const courseDurationMinutes = moment.duration(moment(courseEndTime, 'HH:mm').diff(moment(courseStartTime, 'HH:mm'))).asMinutes();
                          const blockHeight = courseDurationMinutes * unitHeight / 45;
                          const offsetMinutes = moment.duration(moment(courseStartTime, 'HH:mm').diff(moment(time, 'HH:mm'))).asMinutes();
                          const offset = offsetMinutes * unitHeight / 45;
                          console.log(`minutes: ${courseDurationMinutes}`);
                          console.log(blockHeight);
                          return <CourseBlock key={courseIndex} course={course} color={dayColors[day]} height={blockHeight} offset={offset} />;
                        }
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
