import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import 'react-native-get-random-values';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { Semester } from '../types';
import { getAllSemesters, removeSemester } from '../storage/SemestersStorage';
import moment from 'moment';

interface SemesterScreenProps {
  navigation: any;
}

const SemesterScreen: React.FC<SemesterScreenProps> = ({ navigation }) => {
  const [semesters, setSemesters] = useState<Semester[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      fetchSemesters();
    }, [])
  );

  const fetchSemesters = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const fetchedSemesters = await getAllSemesters();
      setSemesters(fetchedSemesters ?? []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleItemPress = (item: Semester) => {
    navigation.navigate('Semester Details', { item });
  };

  const handleDeletePress = async (item: Semester) => {
    Alert.alert(
      'Delete Semester',
      'Are you sure to delete this semester?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            await removeSemester(item.id);
            fetchSemesters();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {isLoading && <Text>Loading semesters...</Text>}
      {error && <Text style={styles.errorText}>Error loading semesters: {error}</Text>}

      {!isLoading && !error && (
        <FlatList
          contentContainerStyle={styles.listContent}
          data={semesters}
          renderItem={({ item }) => (
            <View style={styles.itemBlock}>
              <TouchableOpacity onPress={() => handleItemPress(item)}>
                <View>
                  <Text style={styles.itemTitle}>{item.name}</Text>
                  <Text style={styles.itemTitle}>Start: {moment(item.start).format('MM-DD-YYYY')}</Text>
                  <Text style={styles.itemTitle}>End: {moment(item.end).format('MM-DD-YYYY')}</Text>
                  <Text style={styles.itemTitle}>Credits: </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeletePress(item)}>
                <Icon name="delete" size={25} />
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('Add Semester', { setSemesters })}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorText: {
    color: 'red',
  },
  listContent: {
    paddingBottom: 70,
  },
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

export default SemesterScreen;
