/* eslint-disable camelcase */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { RectButton } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { View, Text } from 'react-native';
import { formatPhoneNumber } from 'utils';
import Config from 'react-native-config';
import Button from '../../components/Button';

export default class businessListItem extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    onPress: PropTypes.func.isRequired,
    currentLocation: PropTypes.object.isRequired,
    advertisementType: PropTypes.number.isRequired,
    isMap: PropTypes.bool,
  };

  static defaultProps = {
    isMap: false,
  };

  state = {
    distance: '',
  };

  constructor(props) {
    super(props);
    const isAdvertiser = props.item.advertiser !== 'N';

    if (isAdvertiser && props.currentLocation) {
      const { bus_latitude, bus_longitude } = props.item;
      const { latitude, longitude } = props.currentLocation;
      if (latitude && longitude && bus_latitude && bus_longitude) {
        this.getDistance(`${latitude},${longitude}`, `${bus_latitude},${bus_longitude}`);
      }
    }
  }

  getDistance = (origin, destination) => {
    fetch(
      `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&key=${
        Config.GOOGLE_DISTANCE_MATRIX_API_KEY
      }`,
    )
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.rows[0] && responseJson.rows[0].elements[0]) {
          this.setState({ distance: responseJson.rows[0].elements[0].distance.text });
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  renderAdvertiserView = (item, distance) => {
    return (
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <View style={{ height: 60, width: 60, backgroundColor: 'gray' }} />
        <View style={{ flex: 1, paddingHorizontal: 10 }}>
          <Text
            style={{ fontSize: 16, fontWeight: '400', lineHeight: 24 }}
            numberOfLines={1}
            allowFontScaling={false}
          >
            {item.bus_name}
          </Text>
          <Text
            style={{ fontSize: 16, fontWeight: '400', lineHeight: 24 }}
            numberOfLines={1}
            allowFontScaling={false}
          >
            {formatPhoneNumber(item.bus_phone)}
          </Text>
          {!!distance && (
            <Text
              style={{ fontSize: 16, fontWeight: '400', lineHeight: 24 }}
              numberOfLines={1}
              allowFontScaling={false}
            >
              {`Current Distance: ${distance}`}
            </Text>
          )}
        </View>
      </View>
    );
  };

  renderNonAdvertiserView = item => {
    return (
      <View style={{ flex: 1 }}>
        <Text
          style={{ fontSize: 16, fontWeight: '400', lineHeight: 24 }}
          numberOfLines={1}
          allowFontScaling={false}
        >
          {item.bus_name}
        </Text>
        <Text
          style={{ fontSize: 16, fontWeight: '400', lineHeight: 24 }}
          numberOfLines={1}
          allowFontScaling={false}
        >
          {formatPhoneNumber(item.bus_phone)}
        </Text>
      </View>
    );
  };

  render() {
    const { item, onPress, isMap, advertisementType } = this.props;
    const { distance } = this.state;
    const isAdvertiser = item.advertiser !== 'N' && advertisementType === 1;

    if (isMap) {
      return (
        <View style={{ flex: 1, justifyContent: 'space-between' }}>
          <View style={{ flex: 1, flexDirection: 'row', padding: 10, alignItems: 'center' }}>
            {isAdvertiser
              ? this.renderAdvertiserView(item, distance)
              : this.renderNonAdvertiserView(item)}
          </View>
          <Button value="View Details" onPress={() => onPress(distance)} />
        </View>
      );
    }
    return (
      <RectButton style={{ flexDirection: 'row' }} onPress={() => onPress(distance)}>
        <View style={{ flex: 1, flexDirection: 'row', padding: 10, alignItems: 'center' }}>
          {isAdvertiser
            ? this.renderAdvertiserView(item, distance)
            : this.renderNonAdvertiserView(item)}
          <Icon name="play-arrow" size={18} color="#4A4A4A" />
        </View>
      </RectButton>
    );
  }
}
