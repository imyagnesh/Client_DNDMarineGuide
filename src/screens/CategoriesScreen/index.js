import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import FastImage from 'react-native-fast-image';

import Button from '../../components/Button';

const index = ({
  navigation: {
    navigate,
    state: { params, routeName },
  },
  advertisement,
}) => {
  const { search } = params;

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
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text
          style={{
            textAlign: 'center',
          }}
        >
          {search.service === 'Dine' ? 'Choose Rest Type' : 'Choose Category'}
        </Text>
        <Button
          value="All Categories"
          onPress={() => {
            navigate('BusinessList', { search, routeName });
          }}
        />
        <Button
          value="Choose Specific"
          onPress={() => {
            navigate('CategoryList', { search, routeName });
          }}
        />
      </View>
    </View>
  );
};

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

export default connect(mapStateToProps)(memo(index));
