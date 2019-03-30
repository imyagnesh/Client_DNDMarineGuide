import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, Image, PixelRatio, Animated, Text, SafeAreaView } from 'react-native';
import Config from 'react-native-config';
import { HEIGHT, Api, timeout } from 'utils';

export default class index extends PureComponent {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
  };

  state = {
    imageAnim: new Animated.Value(0),
  };

  componentDidMount() {
    this.getAdvertisement();
    const { imageAnim } = this.state;
    Animated.timing(imageAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }

  getAdvertisement = async () => {
    try {
      const res = await fetch(`${Config.API_URL}/getAdvertisements?addType=1`);
      const advertisement = await res.json();
      const { length } = advertisement;
      if (length > 0) {
        const i = Math.floor(Math.random() * length);
        this.setState({ advertisement: advertisement[i] });
      } else {
        this.setState({ advertisement: advertisement[0] });
      }
    } catch (error) {
      this.redirect();
    }
  };

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
    const { imageAnim, advertisement } = this.state;

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
              <Image
                onLoad={this.redirect}
                source={{ uri: advertisement.ad_url }}
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
