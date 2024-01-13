import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import moment from 'moment';

import { Task } from '../types';

type TaskBlockProps = {
    Task: Task;
    color?: string;
    height?: number;
    offset?: number;
}

const CourseBlock: React.FC<TaskBlockProps> = ({ Task, color = '#e3e3e3', height = 90, offset = 0 }) => {
    return (
        <View style={[styles.block, { backgroundColor: color, height: height, marginTop: offset }]}>
            <Text style={styles.taskName}>{Task.name}</Text>
            <Text style={styles.taskType}>{Task.type}</Text>
            <Text style={styles.taskDue}>Start: {moment(Task.dueDate).format('YYYY-MM-DD')}</Text>

        </View>
    );
};

const styles = StyleSheet.create({
    block: {
        padding: 5,
        position: 'absolute',
        width: '100%',
        borderRadius: 10,
    },
    taskName: {
        fontSize: 14,
        fontWeight: '700',
    },
    taskType: {
        fontSize: 13,
        fontWeight: '300',
    },
    taskDue: {
        fontSize: 13,
    },
});

export default CourseBlock;
