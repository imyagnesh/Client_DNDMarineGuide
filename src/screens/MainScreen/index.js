import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
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
        <Button
          value="Dock"
          onPress={() => {
            navigate('Dock');
          }}
        />
        <Button
          value="Dine"
          onPress={() => {
            navigate('Dine');
          }}
        />
        <Button
          value="Services"
          onPress={() => {
            navigate('Services');
          }}
        />
      </View>
    );
  }
}
