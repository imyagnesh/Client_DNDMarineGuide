import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RectButton } from 'react-native-gesture-handler';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { formatPhoneNumber, openLink } from 'utils';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.002;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default class index extends PureComponent {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
  };

  componentDidMount() {
    this.getDistance();
  }

  getDistance = () => {
    return new Promise((resolve, reject) => {
      fetch(
        'https://maps.googleapis.com/maps/api/distancematrix/json?origins=12.850241,77.646453&destinations=12.850942,77.648502&key=AIzaSyCkJdeBMwuMSVeEM9Li4_EmFvd6gZyyNV8',
      )
        .then(response => response.json())
        .then(responseJson => {
          if (responseJson.rows[0] && responseJson.rows[0].elements[0]) {
            console.warn(responseJson.rows[0].elements[0].distance.text);
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  };

  renderWithAdvertisement = businessDetails => {
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
            <Text style={{ flexDirection: 'row', flexWrap: 'wrap' }}>Current Distance: </Text>
          </View>
        </View>
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
    const {
      navigation: {
        state: { params },
      },
    } = this.props;

    const { businessDetails } = params;

    // if (businessDetails.advertiser === 'N') {
    //   return <Fragment>{this.renderWithoutAdvertisement(businessDetails)}</Fragment>;
    // }
    return <Fragment>{this.renderWithAdvertisement(businessDetails)}</Fragment>;
  }
}
