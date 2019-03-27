import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RectButton } from 'react-native-gesture-handler';
import { formatPhoneNumber, openLink } from 'utils';

export default class index extends PureComponent {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
  };

  render() {
    const {
      navigation: {
        state: { params },
      },
    } = this.props;

    const { businessDetails } = params;

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
  }
}
