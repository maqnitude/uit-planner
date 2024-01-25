import React, { useState } from 'react';
import { TextInput, View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

interface SearchBarProps {
  onSearch: (searchText: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchText, setSearchText] = useState('');

  const handleClear = () => {
    setSearchText('');
    onSearch('');
  };

  const handleSearchTextChange = (text: string) => {
    setSearchText(text);
    onSearch(text);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchIcon}>
        <Icon name="search1" size={19} />
      </View>
      <TextInput
        style={styles.searchBar}
        value={searchText}
        onChangeText={handleSearchTextChange}
        placeholder="Search..."
      />
      {searchText ? (
        <TouchableOpacity style={styles.clearIcon} onPress={handleClear}>
          <Icon name="closecircle" size={19} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 30,
    marginVertical: 10,
    marginHorizontal: 20,
    paddingHorizontal: 10,
  },
  searchBar: {
    flex: 1,
    height: 40,
  },
  searchIcon: {
    marginRight: 5,
  },
  clearIcon: {
    marginLeft: 5,
  },
});

export default SearchBar;
