import React, {useState} from 'react';
import { TextInput, View, Button, StyleSheet } from 'react-native';

const SearchBar = ({ onSearch }) => {
    const [searchQuery, setSearchQuery] = useState('');
  
    const handleClear = () => {
      setSearchQuery('');
    };
  
    const handleSearch = () => {
      onSearch(searchQuery);
    };
  
    return (
      <View style = {styles.container}>
        <TextInput
          style={{ color: '#000000', fontSize: 20, borderColor: 'gray', borderWidth: 1, flex: 1 }}
          placeholder='Type Here...'
          placeholderTextColor={'#000000'}
          onChangeText={text => setSearchQuery(text)}
          onSubmitEditing={handleSearch}
          value={searchQuery}
        />
        <Button
            title="X" 
            onPress={handleClear} 
         />
      </View>
    );
  };

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderColor: 'gray',
        borderWidth: 1,
    },
});
export default SearchBar;
