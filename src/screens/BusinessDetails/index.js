/* eslint-disable camelcase */
import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Platform,
  PermissionsAndroid,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RectButton } from 'react-native-gesture-handler';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import { formatPhoneNumber, openLink } from 'utils';
import Config from 'react-native-config';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.002;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default class index extends PureComponent {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
  };

  state = {
    loading: false,
    distance: null,
    error: false,
  };

  componentDidMount() {
    const {
      navigation: {
        state: { params },
      },
    } = this.props;

    const { businessDetails } = params;
    const { bus_latitude, bus_longitude } = businessDetails;
    if (bus_latitude && bus_longitude) {
      this.getLocation(`${bus_latitude},${bus_longitude}`);
    }
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

  getLocation = async destination => {
    const hasLocationPermission = await this.hasLocationPermission();

    if (!hasLocationPermission) return;

    this.setState({ loading: true }, () => {
      Geolocation.getCurrentPosition(
        async position => {
          try {
            const {
              coords: { latitude, longitude },
            } = position;
            const distance = await this.getDistance(`${latitude},${longitude}`, destination);
            this.setState({ distance, error: false, loading: false });
          } catch (error) {
            this.setState({ error: false, loading: false });
          }
        },
        error => {
          this.setState({ error, loading: false });
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000, distanceFilter: 50 },
      );
    });
  };

  getDistance = (origin, destination) => {
    return new Promise((resolve, reject) => {
      fetch(
        `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&key=${
          Config.GOOGLE_DISTANCE_MATRIX_API_KEY
        }`,
      )
        .then(response => response.json())
        .then(responseJson => {
          if (responseJson.rows[0] && responseJson.rows[0].elements[0]) {
            resolve(responseJson.rows[0].elements[0].distance.text);
          }
          reject(new Error('Error'));
        })
        .catch(error => {
          reject(error);
        });
    });
  };

  renderWithAdvertisement = businessDetails => {
    const { distance, error } = this.state;
    console.log(error);
    return (
      <View style={{ flex: 1 }}>
        <Text
          style={{ fontSize: 16, fontWeight: '400', lineHeight: 24, padding: 10 }}
          numberOfLines={1}
          allowFontScaling={false}
        >
          {businessDetails.bus_name}
        </Text>
        {businessDetails.bus_longitude && businessDetails.bus_latitude && (
          <MapView
            ref={map => {
              this.map = map;
            }}
            style={{
              height: 200,
              marginHorizontal: 10,
              flexDirection: 'row',
            }}
            initialRegion={{
              latitude: businessDetails.bus_latitude,
              longitude: businessDetails.bus_longitude,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            }}
            provider={PROVIDER_GOOGLE}
            scrollEnabled={false}
          >
            <Marker
              coordinate={{
                latitude: businessDetails.bus_latitude,
                longitude: businessDetails.bus_longitude,
              }}
            />
          </MapView>
        )}
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1 }} />
          <View style={{ flex: 3, padding: 10 }}>
            <Text style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {`${businessDetails.bus_address || ''} ${businessDetails.bus_address2 ||
                ''} ${businessDetails.bus_city || ''} ${businessDetails.stateName ||
                ''} ${businessDetails.bus_zip || ''} ${businessDetails.countryName || ''}`}
            </Text>
            <RectButton
              style={{ flexDirection: 'row' }}
              onPress={() => openLink(`tel:${businessDetails.bus_phone}`)}
            >
              <View style={{ flex: 1, flexDirection: 'row', padding: 10, alignItems: 'center' }}>
                <Icon name="phone" size={24} color="#000" />
                <Text
                  style={{ fontSize: 16, fontWeight: '400', lineHeight: 24, paddingHorizontal: 10 }}
                  numberOfLines={1}
                  allowFontScaling={false}
                >
                  {formatPhoneNumber(businessDetails.bus_phone)}
                </Text>
              </View>
            </RectButton>
            <Text style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {`Current Distance: ${distance || 'Not Found'}`}
            </Text>
          </View>
        </View>
        {businessDetails.bus_website && (
          <RectButton
            style={{ flexDirection: 'row' }}
            onPress={() => openLink(businessDetails.bus_website)}
          >
            <View style={{ flex: 1, flexDirection: 'row', padding: 10, alignItems: 'center' }}>
              <Icon name="explore" size={24} color="#000" />
              <Text
                style={{ fontSize: 16, fontWeight: '400', lineHeight: 24, paddingHorizontal: 10 }}
                numberOfLines={1}
                allowFontScaling={false}
              >
                {businessDetails.bus_website}
              </Text>
            </View>
          </RectButton>
        )}
      </View>
    );
  };

  renderWithoutAdvertisement = businessDetails => {
    return (
      <View style={{ flex: 1 }}>
        <Text
          style={{ fontSize: 16, fontWeight: '400', lineHeight: 24, padding: 10 }}
          numberOfLines={1}
          allowFontScaling={false}
        >
          {businessDetails.bus_name}
        </Text>
        <RectButton
          style={{ flexDirection: 'row' }}
          onPress={() => openLink(`tel:${businessDetails.bus_phone}`)}
        >
          <View style={{ flex: 1, flexDirection: 'row', padding: 10, alignItems: 'center' }}>
            <Icon name="phone" size={24} color="#000" />
            <Text
              style={{ fontSize: 16, fontWeight: '400', lineHeight: 24, paddingHorizontal: 10 }}
              numberOfLines={1}
              allowFontScaling={false}
            >
              {formatPhoneNumber(businessDetails.bus_phone)}
            </Text>
          </View>
        </RectButton>
        <View
          style={{
            flexDirection: 'row',
            height: StyleSheet.hairlineWidth,
            backgroundColor: '#4a4a4a',
          }}
        />
      </View>
    );
  };

  render() {
    const { loading } = this.state;
    const {
      navigation: {
        state: { params },
      },
    } = this.props;

    if (loading) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ActivityIndicator size="large" animating />
        </View>
      );
    }

    const { businessDetails } = params;

    // if (businessDetails.advertiser === 'N') {
    //   return <Fragment>{this.renderWithoutAdvertisement(businessDetails)}</Fragment>;
    // }
    return <Fragment>{this.renderWithAdvertisement(businessDetails)}</Fragment>;
  }
}
