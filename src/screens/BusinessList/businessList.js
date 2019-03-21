import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, ActivityIndicator, FlatList, StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RectButton } from 'react-native-gesture-handler';

export default class index extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    clearBusinesses: PropTypes.func.isRequired,
    fetchBusinesses: PropTypes.func.isRequired,
    businesses: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
  };

  state = {
    page: 1,
    result: 20,
  };

  constructor(props) {
    super(props);
    const {
      navigation: {
        state: { params },
      },
      clearBusinesses,
      fetchBusinesses,
    } = props;
    const { search } = params;
    const { page, result } = this.state;
    clearBusinesses();
    fetchBusinesses({ page, result, ...search });
  }

  _renderItem = ({ item }) => {
    return (
      <RectButton onPress={() => {}}>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', padding: 10 }}>
          <View style={{ flex: 1 }}>
            <Text>{item.bus_name}</Text>
            <Text>{item.bus_phone}</Text>
          </View>
          <Icon name="play-arrow" size={18} color="#4A4A4A" />
        </View>
      </RectButton>
    );
  };

  _keyExtractor = item => {
    return `${item.bus_cd}`;
  };

  _renderFooter = () => {
    if (!this.props.loading) return null;

    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 10,
        }}
      >
        <ActivityIndicator animating size="large" />
      </View>
    );
  };

  _loadMore = () => {
    const {
      businesses: { businesses, recordsTotal },
      navigation: {
        state: { params },
      },
      fetchBusinesses,
    } = this.props;

    const { search } = params;

    if (businesses.length < recordsTotal) {
      this.setState(
        state => {
          return { page: state.page + 1 };
        },
        () => {
          const { page, result } = this.state;
          fetchBusinesses({ page, result, ...search });
        },
      );
    }
  };

  _itemSeparator = () => {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          height: StyleSheet.hairlineWidth,
          backgroundColor: '#4a4a4a',
        }}
      />
    );
  };

  render() {
    const {
      businesses: { businesses },
      loading,
    } = this.props;
    return (
      <FlatList
        data={businesses}
        renderItem={this._renderItem}
        keyExtractor={this._keyExtractor}
        ListFooterComponent={this._renderFooter}
        refreshing={loading}
        onEndReached={this._loadMore}
        onEndReachedThreshold={0}
        ItemSeparatorComponent={this._itemSeparator}
      />
    );
  }
}
