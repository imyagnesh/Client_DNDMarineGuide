import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import Button from '../Button';

const index = ({ onSearchAgain }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginHorizontal: 50 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', lineHeight: 36 }}>
        Sorry! no Result Found
      </Text>
      <Text style={{ fontSize: 14, fontWeight: '400', lineHeight: 20, textAlign: 'center', paddingVertical: 8, color: '#4A4A4A' }}>
        Please modify your search criteria and you will find results matching your needs
      </Text>
      <View style={{ width: 250 }}>
        <Button value="Search Again" onPress={onSearchAgain} />
      </View>
    </View>
  );
};

index.propTypes = {
  onSearchAgain: PropTypes.func.isRequired,
};

export default index;
