import React, { useState } from 'react';
import { View, Alert, } from 'react-native';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

import { ClassPeriod, Course, Task } from '../types';
import FormTemplate from '../components/FormTemplate';

import { storeTask } from '../storage/TasksStorage';

const AddTaskScreen = ({ route, navigation }) => {
    const { course, setCourses } = route.params;
    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [dueDateStart, setDueDateStart] = useState(new Date())
    const [dueDateEnd, setDueDateEnd] = useState(new Date())
    const [courseId, setCourseId] = useState(course.code)
    const [completed, setCompleted] = useState(Boolean)

    const fields = [
        {
            label: 'Name Task',
            placeholder: 'Enter name task',
            value: name,
            onChangeText: setName,
        },
        {
            label: 'Type Task',
            placeholder: 'Enter type task',
            value: type,
            onChangeText: setType,
        },
        {
            label: 'Due Day Start',
            placeholder: 'Select day',
            value: dueDateStart,
            isDatePicker: true,
            FormData: "YYYY-MM-DD",
            mode: 'Date',
            onDateChange: setDueDateStart,
        },
        {
            label: 'Due Day End',
            placeholder: 'Select day',
            value: dueDateEnd,
            isDatePicker: true,
            FormData: "YYYY-MM-DD",
            mode: 'Date',
            onDateChange: setDueDateEnd,
        },

    ];

    const resetState = () => {
        setName('');
        setType('');
        setDueDateStart(new Date());
        setDueDateEnd(new Date());


    };

    const handleSubmit = async () => {
        if (!name || name.length > 100) {
            Alert.alert('Invalid input', 'Please enter a valid course name (1-100 characters).');
            return;
        }

        if (!type || type.length > 100) {
            Alert.alert('Invalid input', 'Please enter a valid course code (1-100 characters).');
            return;
        }



        const newTask: Task = {
            id: uuidv4(),
            name,
            type,
            dueDateStart,
            dueDateEnd,
            courseId,
            completed,

        };

        await storeTask(newTask);

        resetState();

        Alert.alert(
            'Success',
            'Task was added successfully',
            [
                { text: 'OK', onPress: () => navigation.goBack() },

            ]
        );
    };

    return (
        <View>
            <FormTemplate fields={fields} onSubmit={handleSubmit} />
        </View>
    );
};

export default AddTaskScreen;
