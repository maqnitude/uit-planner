import React, { useState } from 'react';
import { ScrollView, View, Text, Dimensions, StyleSheet } from 'react-native';
import moment from 'moment';
import { useFocusEffect } from '@react-navigation/native';

import CourseBlock from '../components/CourseBlock';
import { Course } from '../types';
import { getAllCourses } from '../storage/CoursesStorage';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const TIME_STAMPS = ['7:30', '8:15', '9:00', '9:45', '10:30', '11:15', '12:00', '12:45', '13:00', '13:45', '14:30', '15:15', '16:15', '17:00'];
const DAY_COLORS = {
  'Monday': '#CBE4F9',
  'Tuesday': '#CDF5F6',
  'Wednesday': '#EFF9DA',
  'Thursday': '#F9EBDF',
  'Friday': '#F9D8D6',
  'Saturday': '#D6CDEA',
};
const TIMES = TIME_STAMPS.map(time => moment(time, 'HH:mm'));

const TimeTable = () => {
  const [courses, setCourses] = useState<Course[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchCourses = async () => {
        const fetchedCourses = await getAllCourses();
        setCourses(fetchedCourses ?? []);
      };
      fetchCourses();
    }, [])
  );

  const screenWidth = Dimensions.get('window').width;
  const timeStampWidth = 50;
  const headerHeight = 30;
  const unitHeight = 90;
  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.row}>
          <View style={{ marginBottom: unitHeight, marginTop: headerHeight }}>
            {TIME_STAMPS.map((time, index) => (
              <View key={index} style={[styles.timeStamp, {width: timeStampWidth, height: unitHeight, borderTopWidth: index === 0 ? 0.5 : 0}]}>
                <Text style={styles.boldText}>{time}</Text>
              </View>
            ))}
          </View>
          <ScrollView horizontal>
            <View style={styles.row}>
              {DAYS.map((day, dayIndex) => (
                <View key={dayIndex} style={{ width: (screenWidth - timeStampWidth) / 3 }}>
                  <Text style={[styles.header, styles.boldText, {height: headerHeight}]}>{day}</Text>
                  {TIMES.map((time, timeIndex) => {
                    return <View key={timeIndex} style={[styles.timeSlot, {height: unitHeight}]}>
                      {courses.map((course, courseIndex) => {
                        const courseStartTime = moment(course.schedule[0].startTime).format('HH:mm');
                        const courseEndTime = moment(course.schedule[0].endTime).format('HH:mm');
                        const timeSlotEnd = moment(time).add(45, 'minutes').format('HH:mm');
                        if (courseStartTime >= time.format('HH:mm') && courseStartTime < timeSlotEnd && course.schedule[0].day === day) {
                          const courseDurationMinutes = moment.duration(moment(courseEndTime, 'HH:mm').diff(moment(courseStartTime, 'HH:mm'))).asMinutes();
                          const blockHeight = courseDurationMinutes * unitHeight / 45;
                          const offsetMinutes = moment.duration(moment(courseStartTime, 'HH:mm').diff(moment(time, 'HH:mm'))).asMinutes();
                          const offset = offsetMinutes * unitHeight / 45;
                          return <CourseBlock key={courseIndex} course={course} color={DAY_COLORS[day]} height={blockHeight} offset={offset} />;
                        }
                        return null;
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  row: {
    flexDirection: 'row',
  },
  timeStamp: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderRightWidth: 0.5,
  },
  boldText: {
    fontWeight: 'bold',
  },
  header: {
    textAlign: 'center',
    backgroundColor: '#b5e2ff',
    borderLeftWidth: 0.5,
    borderBottomWidth: 0.5,
  },
  timeSlot: {
    borderRightWidth: 0.5,
    borderBottomWidth: 0.5,
  },
});


export default TimeTable;
