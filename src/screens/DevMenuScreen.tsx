import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface DevMenuScreenProps {
  navigation: any;
}

const DevMenuScreen: React.FC<DevMenuScreenProps> = ({ navigation }) => {
  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity>
        <View style={styles.button}>
          <Text style={{ color: 'white' }}>Populate Database</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity>
        <View style={styles.button}>
          <Text style={{ color: 'white' }}>Inspect Database</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity>
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
