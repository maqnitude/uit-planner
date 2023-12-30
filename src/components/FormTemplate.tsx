import React from 'react';
import { Text, View, TextInput, Button, StyleSheet } from 'react-native';

interface FormField {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
}

interface FormTemplateProps {
  fields: FormField[];
  onSubmit: () => void;
}

const FormTemplate: React.FC<FormTemplateProps> = ({ fields, onSubmit }) => {
  return (
    <View>
      {fields.map((field, index) => (
        <View key={index} style={styles.inputContainer}>
          <Text style={styles.label}>{field.label}</Text>
          <TextInput
            style={styles.input}
            placeholder={field.placeholder}
            value={field.value}
            onChangeText={field.onChangeText}
          />
        </View>
      ))}
      <View style={styles.buttonContainer}>
        <Button title="Submit" onPress={onSubmit} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
  label: {
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },
  buttonContainer: {
    margin: 20,
  },
});

export default FormTemplate;
