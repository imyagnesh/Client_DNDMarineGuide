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
        Search By City
      </Text>
      <Button
        value="All"
        onPress={() => {
          navigate('CityList', { search });
        }}
      />
      <Button
        value="Near By"
        onPress={() => {
          navigate(search.service === 'Dock' ? 'BusinessList' : 'Categories', {
            search: { ...search, cities: [search.city].toString() },
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
