import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { clearStorage, populateStorage } from "../storage/Storage";

interface DevMenuScreenProps {
  navigation: any;
}

const DevMenuScreen: React.FC<DevMenuScreenProps> = ({ navigation }) => {
  const populateDatabase = async () => {
    Alert.alert(
      'Populate Database',
      'This action will first clear all the data currently in storage. Are you sure to continue?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            await clearStorage();
            await populateStorage();
          }
        }
      ]
    );
  };

  const clearDatabase = async () => {
    Alert.alert(
      'Clear Database',
      'Are you sure to clear all data in database?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            await clearStorage();
          }
        }
      ]
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity onPress={() => populateDatabase()}>
        <View style={styles.button}>
          <Text style={{ color: 'white' }}>Populate Database</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity>
        <View style={styles.button}>
          <Text style={{ color: 'white' }}>Inspect Database</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => clearDatabase()}>
        <View style={styles.button}>
          <Text style={{ color: 'white' }}>Clear Database</Text>
        </View>
      </TouchableOpacity>
      <View style={{ flexGrow: 1, borderWidth: 2, margin: 20 }}>
        <Text style={{ color: 'black', fontSize: 24 }}>output erea</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1e90ff',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    marginTop: 20,
    marginHorizontal: 20,
    padding: 10,
  },
});

export default DevMenuScreen;
