import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import Button from '../Button';

const index = ({ title, text, buttonText, onRetry }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginHorizontal: 50 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', lineHeight: 36 }}>{title}</Text>
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
        {text}
      </Text>
      <View style={{ width: 250 }}>
        <Button value={buttonText} onPress={onRetry} />
      </View>
    </View>
  );
};

index.propTypes = {
  onRetry: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
};

export default index;
