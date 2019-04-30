import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, Image, PixelRatio, Animated, Text, SafeAreaView } from 'react-native';
import Config from 'react-native-config';
import { connect } from 'react-redux';
import FastImage from 'react-native-fast-image';
import { HEIGHT, action } from 'utils';
import { FETCH_ADVERTISEMENT, CLEAR_ADVERTISEMENT, REQUEST } from '../../constants/actionTypes';

class index extends PureComponent {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    getAdvertisement: PropTypes.func.isRequired,
    advertisement: PropTypes.object.isRequired,
    clearAdvertisement: PropTypes.func.isRequired,
    error: PropTypes.bool.isRequired,
  };

  state = {
    imageAnim: new Animated.Value(0),
  };

  constructor(props) {
    super(props);
    props.clearAdvertisement();
    props.getAdvertisement(1);
  }

  componentDidMount() {
    const { imageAnim } = this.state;
    Animated.timing(imageAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.error && this.props.error !== nextProps.error) {
      this.redirect();
    }
  }

  redirect = () => {
    this.timeout = setTimeout(() => {
      const {
        navigation: { navigate },
      } = this.props;
      navigate('App');
    }, parseInt(Config.IntroAddTimer, 10));
  };

  componentWillUnmount = () => {
    clearTimeout(this.timeout);
  };

  render() {
    const { imageAnim } = this.state;

    const { advertisement } = this.props;

    const translateY = imageAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -((HEIGHT - 200) / 2)],
    });

    const scaleX = imageAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0.7],
    });

    const scaleY = imageAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0.7],
    });

    return (
      <SafeAreaView style={{ backgroundColor: '#5DAFDE', flex: 1 }}>
        <Animated.View
          style={{
            flexDirection: 'row',
            marginHorizontal: 20,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
            transform: [
              {
                translateY,
              },
              { scaleX },
              { scaleY },
            ],
          }}
        >
          <Image
            source={require('../../img/LogoM.png')}
            resizeMode="contain"
            style={{ flex: 1, height: null, width: null, aspectRatio: PixelRatio.get() }}
          />
        </Animated.View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          {advertisement && (
            <View>
              <Text
                style={{
                  textAlign: 'center',
                  color: '#fff',
                  fontSize: 20,
                  fontWeight: '500',
                  marginVertical: 10,
                }}
              >
                Presented By
              </Text>
              <FastImage
                onLoad={this.redirect}
                source={{ uri: advertisement.ad_url, priority: FastImage.priority.high }}
                resizeMode="contain"
                style={{ height: 250, width: 250 }}
              />
            </View>
          )}
        </View>
        <Text style={{ color: '#fff', opacity: 0.8, textAlign: 'center', marginVertical: 10 }}>
          {`Copyright \u00A9 2019 - DND`}
        </Text>
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state) {
  return {
    advertisement: state.advertisement,
    error: !!state.error.FETCH_ADVERTISEMENT,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getAdvertisement: search => dispatch(action(`${FETCH_ADVERTISEMENT}_${REQUEST}`, search)),
    clearAdvertisement: () => dispatch(action(CLEAR_ADVERTISEMENT)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(index);
