import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import 'react-native-get-random-values';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import { Course, Task } from '../types';
import { getAllTasks, removeTask } from '../storage/TasksStorage';


const TaskScreen = ({ route, navigation }) => {
    const { course, setCourses } = route.params;
    const [task, setTask] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    useFocusEffect(
        React.useCallback(() => {
            fetchTasks();
        }, [])
    );
    const fetchTasks = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const fetchedTasks = await getAllTasks();
            setTask(fetchedTasks ?? []);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setIsLoading(false);
        }
    };
    const handleDeletePress = async (item: Task) => {
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
                        await removeTask(item.id);
                        fetchTasks();
                    },
                },
            ]
        );
    };
    return (
        <View style={styles.container}>
            {isLoading && <Text>Loading Tasks...</Text>}
            {error && <Text style={styles.errorText}>Error loading tasks: {error}</Text>}
            <Text style={styles.itemTitleTask} >Task Of {course.name}</Text>
            {!isLoading && !error && (
                <FlatList
                    contentContainerStyle={styles.listContent}
                    data={task}
                    renderItem={({ item }) => {
                        // Add your condition here
                        if (item.courseId == course.code) {
                            return (
                                <View style={styles.itemBlock}>
                                    <TouchableOpacity>
                                        <View>
                                            <Text style={styles.itemTitle}>{item.name}</Text>
                                            <Text style={styles.itemCode}>{item.courseId}</Text>
                                            <View style={styles.containerDue}>
                                                <Text style={styles.itemDue}>Start: {moment(item.dueDateStart).format('DD/MM')}</Text>
                                                <Text style={styles.itemDue}>End: {moment(item.dueDateEnd).format('DD/MM')}</Text>
                                                <Text style={styles.itemDay}>({moment(item.dueDateEnd).format('hh:mm A')})</Text>
                                            </View>
                                            <Text style={styles.itemDay}>Days Remaining: {moment(item.dueDateEnd).diff(moment(item.dueDateStart), 'h')}h</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => handleDeletePress(item)}>
                                        <Icon name="delete" size={25} />
                                    </TouchableOpacity>
                                </View>
                            );
                        } else {
                            // Return null or an empty View for items that don't meet the condition
                            return null;
                        }
                    }}
                    keyExtractor={item => item.name}
                />

            )}
            <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('Add Task', { course: course }, { setTask })}>
                <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    containerDue: {

        display: 'flex',
        flexDirection: 'row', // Đặt hướng của container thành hàng ngang
        justifyContent: 'space-between',
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
    itemTitleTask: {
        fontSize: 20,
        color: 'blue',
        fontWeight: '900',
        margin: 10,
    },
    itemCode: {
        fontSize: 16,
        color: 'gray',
        margin: 5,
    },
    itemDue: {
        fontSize: 16,
        color: 'blue',
        margin: 5,
    },
    itemDay: {
        fontSize: 16,
        color: 'red',
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
export default TaskScreen;
