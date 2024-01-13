import React from 'react';
import { Text, View, ScrollView, TextInput, Button, StyleSheet } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { Picker } from '@react-native-picker/picker';

interface FormField {
  label: string;
  placeholder?: string;
  value: string | Date;
  onChangeText?: (text: string) => void;
  onDateChange?: (date: Date) => void;
  isDatePicker?: boolean;
  isPicker?: boolean;
  pickerItems?: string[];
  mode?: string;
}

interface FormTemplateProps {
  fields: FormField[];
  onSubmit: () => void;
}

const FormTemplate: React.FC<FormTemplateProps> = ({ fields, onSubmit }) => {
  return (
    <ScrollView>
      {fields.map((field, index) => (
        <View key={index} style={styles.inputContainer}>
          <Text style={styles.label}>{field.label}</Text>
          {field.isDatePicker ? (
            <View style={styles.timeContainer}>
              {field.mode ? (<DatePicker
                date={field.value as Date}
                onDateChange={field.onDateChange}
              />) :
                <DatePicker
                  date={field.value as Date}
                  onDateChange={field.onDateChange}
                  mode="time"
                />
              }

            </View>
          ) : field.isPicker ? (
            <View style={styles.picker}>
              <Picker
                selectedValue={field.value as string}
                onValueChange={(itemValue) => field.onChangeText && field.onChangeText(itemValue)}
              >
                {field.pickerItems?.map((item, itemIndex) => (
                  <Picker.Item key={itemIndex} label={item} value={item} />
                ))}
              </Picker>
            </View>
          ) : (
            <TextInput
              style={styles.input}
              placeholder={field.placeholder}
              value={field.value as string}
              onChangeText={field.onChangeText}
            />
          )}
        </View>
      ))}
      <View style={styles.buttonContainer}>
        <Button title="Submit" onPress={onSubmit} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
  timeContainer: {
    alignItems: 'center',
  },
  label: {
    marginBottom: 5,
  },
  input: {
    // height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },
  picker: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
  },
  buttonContainer: {
    margin: 20,
  },
});

export default FormTemplate;
