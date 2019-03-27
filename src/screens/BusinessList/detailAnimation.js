import React, { Component } from 'react';
import { Animated, Text, Platform } from 'react-native';
import { WIDTH } from 'utils';

const viewHeight = 200;

export default class detailAnimation extends Component {
  static propTypes = {};

  state = {
    hideAnim: new Animated.Value(viewHeight),
  };

  render() {
    return (
      <Animated.View
        style={{
          height: viewHeight,
          width: WIDTH,
          left: 0,
          bottom: 0,
          position: 'absolute',
          backgroundColor: '#fff',
          zIndex: 1,
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          padding: 10,
          marginTop: 10,
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { height: -1, width: 0 },
              shadowOpacity: 0.36,
              shadowRadius: 6.68,
            },
            android: {
              elevation: 11,
            },
          }),
          transform: [
            {
              translateY: this.state.hideAnim,
            },
          ],
        }}
      >
        <Text>Hello World</Text>
      </Animated.View>
    );
  }
}
