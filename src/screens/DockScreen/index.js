import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import Button from '../../components/Button';

export default class index extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
  };

  state = {};

  render() {
    const {
      navigation: { navigate },
    } = this.props;
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
            navigate('CitySearch', { searchType: 'Dock' });
          }}
        />
        <Button
          value="Marina"
          onPress={() => {
            navigate('Marina', { searchType: 'Dock' });
          }}
        />
        <Button
          value="Business Category"
          onPress={() => {
            navigate('Services', { searchType: 'Dock' });
          }}
        />
      </View>
    );
  }
}
