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
      navigation: {
        navigate,
        state: { params },
      },
    } = this.props;
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
            navigate('NearBy', { search });
          }}
        />
      </View>
    );
  }
}
