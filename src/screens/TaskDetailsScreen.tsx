import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TextInput } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { getTask, updateTask } from '../storage/TasksStorage';
import { ClassPeriod, Task } from '../types';
import moment from 'moment';
interface TaskDetailsScreenProps {
    navigation: any;
    route: any;
}

const TaskDetailsScreen: React.FC<TaskDetailsScreenProps> = ({ navigation, route }) => {
    const { item: task, settask } = route.params;
    const [taskDetails, settaskDetails] = useState(task);
    const currentDate = moment();
    const [inputValue, setInputValue] = useState(task.description);
    const [name, setName] = useState(task.name);
    const [type, setType] = useState(task.type);
    const [dueDateStart, setDueDateStart] = useState(task.dueDateStart)
    const [dueDateEnd, setDueDateEnd] = useState(task.dueDateEnd)
    const [courseId, setCourseId] = useState(task.courseId)
    const [description, setDescription] = useState(task.description)
    const [completed, setCompleted] = useState(task.completed)

    const handleInputChange = async (text: string) => {
        setInputValue(text);
        setDescription(text);
        const updatedTask: Task = {
            ...task,
            name,
            type,
            dueDateStart,
            dueDateEnd,
            courseId,
            description,
            completed,
        };
        await updateTask(updatedTask);
    };
    useFocusEffect(
        React.useCallback(() => {
            const fetchUpdatedCourse = async () => {
                const updatedCourse = await getTask(task.id);
                settaskDetails(updatedCourse);
            };
            fetchUpdatedCourse();
        }, [task.id])
    );
    const [timeRemaining, setTimeRemaining] = useState<string | null>(null);;

    useEffect(() => {
        const dueDateEnd = moment(task.dueDateEnd);
        const currentDate = moment();

        const remainingTime = moment.duration(dueDateEnd.diff(currentDate));

        const hours = remainingTime.hours();
        const minutes = remainingTime.minutes();
        const seconds = remainingTime.seconds();

        setTimeRemaining(`${hours}h${minutes}m${seconds}s`);
    }, [task.dueDateEnd]);
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{taskDetails.name}</Text>
            <Text style={styles.detail}>type: {taskDetails.type}</Text>
            <View style={styles.containerDue}>
                <Text style={styles.itemDue}>Start: {moment(taskDetails.dueDateStart).format('DD/MM/YYYY')}</Text>
                <Text style={styles.itemDay}>({moment(taskDetails.dueDateStart).format('hh:mm A')})</Text>
            </View>
            <View style={styles.containerDue}>
                <Text style={styles.itemDue}>End  : {moment(taskDetails.dueDateEnd).format('DD/MM/YYYY')}</Text>
                <Text style={styles.itemDay}>({moment(taskDetails.dueDateEnd).format('hh:mm A')})</Text>
            </View>
            {timeRemaining !== null && <Text style={styles.itemDay}>Time Remaining: {timeRemaining} </Text>}
            <Text style={styles.itemDue}>Description</Text>
            <TextInput
                style={{
                    height: 300,
                    borderColor: 'gray',
                    borderWidth: 1,
                    marginTop: 15,
                    padding: 15,
                    textAlignVertical: 'top',
                    borderRadius: 10,
                    fontSize: 20,
                    fontWeight: 'bold'
                }}
                placeholder="Type something..."
                onChangeText={handleInputChange}
                value={inputValue}
                multiline
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 40,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    detail: {
        fontSize: 20,
        marginBottom: 10,
    },
    itemDue: {
        fontSize: 25,
        color: 'blue',
        fontWeight: 'bold',
        margin: 2,


    },
    itemDay: {
        fontSize: 25,
        color: 'red',
        fontWeight: 'bold',
        margin: 2,


    },
    containerDue: {

        display: 'flex',
        flexDirection: 'row', // Đặt hướng của container thành hàng ngang
        justifyContent: 'space-between',
    },
});

export default TaskDetailsScreen;
