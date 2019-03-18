import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';

export default class index extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
  };

  state = {};

  componentDidMount() {
    setTimeout(() => {
      const {
        navigation: { navigate },
      } = this.props;
      navigate('App');
    }, 1000);
  }

  render() {
    return (
      <View style={{ backgroundColor: '#5DAFDE', flex: 1 }}>
        <Text>Splash Screen</Text>
      </View>
    );
  }
}
