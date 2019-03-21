import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';

import Button from '../../components/Button';

const index = ({
  navigation: {
    navigate,
    state: { params },
  },
}) => {
  const { search } = params;
  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <Text
        style={{
          textAlign: 'center',
        }}
      >
        Search By
      </Text>
      <Button
        value="All Categories"
        onPress={() => {
          navigate('BusinessList', { search });
        }}
      />
      <Button
        value="Choose Specific"
        onPress={() => {
          navigate('CategoryList', { search });
        }}
      />
    </View>
  );
};

index.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default memo(index);
