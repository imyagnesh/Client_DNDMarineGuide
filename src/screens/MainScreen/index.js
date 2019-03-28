import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import Config from 'react-native-config';
import Button from '../../components/Button';

const index = ({ navigation: { navigate } }) => {
  console.warn(Config.IOS_GOOGLE_MAPS_API_KEY);
  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <Button
        value="Dock"
        onPress={() => {
          navigate('Dock', {
            search: {
              service: 'Dock',
            },
          });
        }}
      />
      <Button
        value="Dine"
        onPress={() => {
          navigate('Dine', {
            search: {
              service: 'Dine',
            },
          });
        }}
      />
      <Button
        value="Services"
        onPress={() => {
          navigate('Categories', {
            search: {},
          });
        }}
      />
    </View>
  );
};

index.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default memo(index);
