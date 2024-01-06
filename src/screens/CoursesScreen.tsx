import React, { useEffect, useState} from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Course } from '../types';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { storeData, getData } from '../storage/Storage';

interface CoursesScreenProps {
  navigation: any;
}

const CoursesScreen: React.FC<CoursesScreenProps> = ({ navigation }) => {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const courses = await getData('course');
    setCourses(courses);
  };

  const handleItemPress = (item: Course) => {
    navigation.navigate('CourseDetails', {item});
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={courses}
        renderItem={({item}) => (
          <TouchableOpacity onPress={() => handleItemPress(item)}>
            <View style={styles.itemBlock}>
              <Text style={styles.itemTitle}>{item.name}</Text>
              <Text style={styles.itemCode}>{item.code}</Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.code}
      />
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('Add Course', { setCourses })}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  itemBlock: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    alignItems: 'flex-start',
    marginTop: 20,
    marginHorizontal: 20,
    padding: 10,
  },
  itemTitle: {
    fontSize: 26,
    color: 'black',
    fontWeight: '700',
  },
  itemCode: {
    color: 'gray',
    margin: 5,
  },
  addButton: {
    backgroundColor: '#1e90ff',
    width: 50,
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  addButtonText: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
});

export default CoursesScreen;
