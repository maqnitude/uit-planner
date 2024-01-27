import React, { useState } from 'react';
import { ScrollView, View, Text, Dimensions, StyleSheet } from 'react-native';
import moment from 'moment';
import { useFocusEffect } from '@react-navigation/native';
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view';

import CourseBlock from '../components/CourseBlock';
import { Course } from '../types';
import { getAllCourses } from '../storage/CoursesStorage';
import { useCurrentSemester } from '../hooks/CurrentSemesterContext';
import { TimetableCapture } from '../utils/CaptureTimetable';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const TIME_STAMPS = ['7:30', '8:15', '9:00', '10:00', '10:45', '11:30', '13:00', '13:45', '14:30', '15:30', '16:15', '17:00'];
const DAY_COLORS = {
  'Mon': '#CBE4F9',
  'Tue': '#CDF5F6',
  'Wed': '#EFF9DA',
  'Thu': '#F9EBDF',
  'Fri': '#F9D8D6',
  'Sat': '#D6CDEA',
};
const TIMES = TIME_STAMPS.map(time => moment(time, 'HH:mm'));

const TimeTable = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const { currentSemesterId } = useCurrentSemester();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // get courses by semester id
      const fetchedCourses = await getAllCourses();
      const currentCourses = fetchedCourses?.filter(course => course.semesterId === currentSemesterId) ?? [];

      setCourses(currentCourses);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, [currentSemesterId]);

  useFocusEffect(
    React.useCallback(() => {
      fetchCourses();
    }, [fetchCourses])
  );

  const screenWidth = Dimensions.get('window').width;
  const timeStampWidth = 40;
  const headerHeight = 25;
  const unitHeight = 90;
  const heights = TIMES.map((time, index) => {
    const timeEnd = TIMES[index + 1];
    let height = unitHeight;
    if (timeEnd) {
      const duration = timeEnd.diff(time, 'minutes');
      height = duration * (unitHeight / 45);
    }
    return height;
  });

  return (
    <>
      {isLoading && <Text>Loading timetable...</Text>}
      {error && <Text style={styles.errorText}>Error loading timetable: {error}</Text>}
      <View style={styles.container}>
        <ScrollView nestedScrollEnabled={true}>
          <ReactNativeZoomableView
             maxZoom={2}
             minZoom={1}
             zoomStep={0.5}
             initialZoom={1}>
          <TimetableCapture>
            <View style={styles.row}>
              <View style={{ marginBottom: unitHeight, marginTop: headerHeight }}>
                {TIME_STAMPS.map((time, index) => (
                  <View key={index} style={[styles.timeStamp, { width: timeStampWidth, height: heights[index], borderTopWidth: index === 0 ? 0.5 : 0 }]}>
                    <Text style={styles.boldText}>{time}</Text>
                  </View>
                ))}
              </View>
              <View>
                <View style={styles.row}>
                  {DAYS.map((day, dayIndex) => (
                    <View key={dayIndex} style={{ width: (screenWidth - timeStampWidth) / 6 }}>
                      <Text style={[styles.header, styles.boldText, { height: headerHeight }]}>{day}</Text>
                      {TIMES.map((time, timeIndex) => {
                        return <View key={timeIndex} style={[styles.timeSlot, { height: heights[timeIndex] }]}>
                          {courses.map((course, courseIndex) => {
                            const courseStartTime = moment(course.schedule[0].startTime).format('HH:mm');
                            const courseEndTime = moment(course.schedule[0].endTime).format('HH:mm');
                            const timeSlotEnd = TIMES[timeIndex + 1] ? moment(TIMES[timeIndex + 1]).format('HH:mm') : moment(time).add(45, 'minutes').format('HH:mm');
                            if (courseStartTime >= time.format('HH:mm') && courseStartTime < timeSlotEnd && course.schedule[0].day.includes(day)) {
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
              </View>
            </View>
          </TimetableCapture>
          </ReactNativeZoomableView>
        </ScrollView>
      </View>
    </>
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
    backgroundColor: '#f5f5f5',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderRightWidth: 0.5,
  },
  timeSlot: {
    borderRightWidth: 0.5,
    borderBottomWidth: 0.5,
    borderStyle: 'dashed',
  },
  header: {
    paddingTop: 6,
    fontSize: 12,
    textAlign: 'center',
    backgroundColor: '#b5e2ff',
    borderLeftWidth: 0.5,
    borderBottomWidth: 0.5,
  },
  boldText: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  errorText: {
    color: 'red',
  },
});


export default TimeTable;
