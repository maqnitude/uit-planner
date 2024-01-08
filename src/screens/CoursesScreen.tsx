import React, { useEffect, useState} from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Course } from '../types';
import 'react-native-get-random-values';
import { getData, removeInstance } from '../storage/Storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface CoursesScreenProps {
  navigation: any;
}

const CoursesScreen: React.FC<CoursesScreenProps> = ({ navigation }) => {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const fetchedCourses = await getData('course');
    setCourses(fetchedCourses);
  };

  const handleItemPress = (item: Course) => {
    navigation.navigate('CourseDetails', {item});
  };

  const handleDeletePress = async (item: Course) => {
    Alert.alert(
      'Delete Course',
      'Are you sure to delete this course?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            await removeInstance('course', item.id);
            fetchCourses();
          },
        },
      ]
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        contentContainerStyle={{ paddingBottom: 70 }}
        data={courses}
        renderItem={({item}) => (
          <View style={styles.itemBlock}>
            <TouchableOpacity onPress={() => handleItemPress(item)}>
              <View>
                <Text style={styles.itemTitle}>{item.name}</Text>
                <Text style={styles.itemCode}>{item.code}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDeletePress(item)}>
                <Icon name="delete" size={25} />
            </TouchableOpacity>
          </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    marginTop: 20,
    marginHorizontal: 20,
    padding: 10,
  },
  itemTitle: {
    fontSize: 20,
    color: 'black',
    fontWeight: '700',
  },
  itemCode: {
    fontSize: 16,
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
