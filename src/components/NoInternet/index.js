import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import Button from '../Button';

const index = ({ checkNetwork }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginHorizontal: 50 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', lineHeight: 36 }}>No Connection</Text>
      <Text
        style={{
          fontSize: 14,
          fontWeight: '400',
          lineHeight: 20,
          textAlign: 'center',
          paddingVertical: 8,
          color: '#4A4A4A',
        }}
      >
        No Internet connection found. check your connection of try again.
      </Text>
      <View style={{ width: 250 }}>
        <Button value="Try Again" onPress={checkNetwork} />
      </View>
    </View>
  );
};

index.propTypes = {
  checkNetwork: PropTypes.func.isRequired,
};

export default index;
