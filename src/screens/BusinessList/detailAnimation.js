import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Animated, Platform, View } from 'react-native';
import { BorderlessButton } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { WIDTH } from 'utils';

const viewHeight = 200;

export default class detailAnimation extends Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    children: PropTypes.element.isRequired,
  };

  state = {
    hideAnim: new Animated.Value(viewHeight),
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible !== this.props.visible) {
      const { hideAnim } = this.state;
      Animated.timing(hideAnim, {
        toValue: nextProps.visible ? 0 : viewHeight,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }

  render() {
    const { onClose } = this.props;
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
        <BorderlessButton
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
          }}
          onPress={onClose}
        >
          <View
            style={{
              height: 30,
              width: 30,
              backgroundColor: 'rgba(0,0,0,0.6)',
              justifyContent: 'center',
              borderRadius: 15,
            }}
          >
            <Icon name="close" style={{ textAlign: 'center' }} size={24} color="#fff" />
          </View>
        </BorderlessButton>
        {this.props.children}
      </Animated.View>
    );
  }
}
