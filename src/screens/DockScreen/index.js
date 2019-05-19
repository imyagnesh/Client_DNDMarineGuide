import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import FastImage from 'react-native-fast-image';
import { action } from 'utils';
import { FETCH_ADVERTISEMENT, CLEAR_ADVERTISEMENT, REQUEST } from '../../constants/actionTypes';

import Button from '../../components/Button';

class index extends Component {
  componentDidMount() {
    const {
      navigation: { addListener },
      clearAdvertisement,
      getAdvertisement,
    } = this.props;
    this.focusSubscription = addListener('willFocus', () => {
      clearAdvertisement();
      getAdvertisement(1);
    });
  }

  componentWillUnmount() {
    this.focusSubscription.remove();
  }

  render() {
    const {
      navigation: {
        navigate,
        state: { params },
      },
      advertisement,
    } = this.props;
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
            Search By
          </Text>
          <Button
            value="City"
            onPress={() => {
              navigate('Cities', { search });
            }}
          />
          <Button
            value="Marina"
            onPress={() => {
              navigate('MarinaList', { search });
            }}
          />
          <Button
            value="Business Category"
            onPress={() => {
              navigate('Categories', { search });
            }}
          />
          <Button
            value="Near By"
            onPress={() => {
              const hasCategory = search.hasOwnProperty('category');
              navigate(search.service === 'Dock' || hasCategory ? 'BusinessList' : 'Categories', {
                search: { ...search, cities: [search.city].toString() },
              });
            }}
          />
        </View>
      </View>
    );
  }
}

index.propTypes = {
  navigation: PropTypes.object.isRequired,
  advertisement: PropTypes.object.isRequired,
  clearAdvertisement: PropTypes.func.isRequired,
  getAdvertisement: PropTypes.func.isRequired,
};

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
