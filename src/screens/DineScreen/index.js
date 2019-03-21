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
        value="City"
        onPress={() => {
          navigate('Cities', { search });
        }}
      />
      <Button
        value="Marina"
        onPress={() => {
          navigate('MarinaList', { search });
        }}
      />
      <Button
        value="Near By"
        onPress={() => {
          navigate('NearBy', { search });
        }}
      />
    </View>
  );
};

index.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default memo(index);
