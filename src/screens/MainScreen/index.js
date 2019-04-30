import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  PermissionsAndroid,
  Platform,
  Text,
  ToastAndroid,
  View,
  ActivityIndicator,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { connect } from 'react-redux';
import FastImage from 'react-native-fast-image';
import Config from 'react-native-config';

import Button from '../../components/Button';

class index extends Component {
  static propTypes = {};

  state = {
    loading: false,
    city: '',
    error: false,
  };

  componentDidMount() {
    this.getLocation();
  }

  hasLocationPermission = async () => {
    if (Platform.OS === 'ios' || (Platform.OS === 'android' && Platform.Version < 23)) {
      return true;
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (hasPermission) return true;

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) return true;

    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show('Location permission denied by user.', ToastAndroid.LONG);
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show('Location permission revoked by user.', ToastAndroid.LONG);
    }

    return false;
  };

  getLocation = async () => {
    const hasLocationPermission = await this.hasLocationPermission();

    if (!hasLocationPermission) return;

    this.setState({ loading: true }, () => {
      Geolocation.getCurrentPosition(
        async position => {
          const {
            coords: { latitude, longitude },
          } = position;
          try {
            const city = await this.getCityDetails(latitude, longitude);
            this.setState({ error: '', city, loading: false });
          } catch (error) {
            this.setState({ error, city: '', loading: false });
          }
        },
        error => {
          this.setState({ city: '', error, loading: false });
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000, distanceFilter: 50 },
      );
    });
  };

  getCityDetails = (latitude, longitude) => {
    return new Promise((resolve, reject) => {
      fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&sensor=false&key=${
          Config.GOOGLE_GEOCODE_API_KEY
        }`,
      )
        .then(response => response.json())
        .then(responseJson => {
          if (responseJson.results) {
            let city = '';
            responseJson.results.forEach(addressComponent => {
              if (addressComponent.types[0] === 'locality') {
                city = addressComponent.address_components[0].long_name;
              }
            });
            resolve(city);
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  };

  render() {
    const {
      navigation: { navigate },
      advertisement,
    } = this.props;
    const { city, loading, error } = this.state;
    console.log(error);
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          {advertisement && (
            <View>
              <Text
                style={{
                  textAlign: 'center',
                  color: '#000',
                  fontSize: 20,
                  fontWeight: '500',
                  marginVertical: 10,
                }}
              >
                Presented By
              </Text>
              <FastImage
                source={{ uri: advertisement.ad_url, priority: FastImage.priority.high }}
                resizeMode="contain"
                style={{ height: 200, width: 200 }}
              />
            </View>
          )}
        </View>
        {!loading && (
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Button
              value="Dock"
              onPress={() => {
                navigate('Dock', {
                  search: {
                    service: 'Dock',
                    city,
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
                    city,
                  },
                });
              }}
            />
            <Button
              value="Services"
              onPress={() => {
                navigate('Categories', {
                  search: {},
                  city,
                });
              }}
            />
          </View>
        )}
        {loading && (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" animating />
          </View>
        )}
      </View>
    );
  }
}

index.propTypes = {
  navigation: PropTypes.object.isRequired,
  advertisement: PropTypes.object.isRequired,
};
function mapStateToProps(state) {
  return {
    advertisement: state.advertisement,
    error: !!state.error.FETCH_ADVERTISEMENT,
  };
}

// function mapDispatchToProps(dispatch) {
//   return {
//     getAdvertisement: search => dispatch(action(`${FETCH_ADVERTISEMENT}_${REQUEST}`, search)),
//     clearAdvertisement: () => dispatch(action(CLEAR_ADVERTISEMENT)),
//   };
// }

export default connect(mapStateToProps)(index);
