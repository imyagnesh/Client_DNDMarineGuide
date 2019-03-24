import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, ActivityIndicator, FlatList, StyleSheet, Text } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RectButton } from 'react-native-gesture-handler';
import MapView from './mapView';
import NoResult from '../../components/NoResult';

export default class index extends PureComponent {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    clearBusinesses: PropTypes.func.isRequired,
    fetchBusinesses: PropTypes.func.isRequired,
    businesses: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
  };

  static navigationOptions = ({
    navigation: {
      state: { params },
      setParams,
    },
  }) => ({
    headerTransparent: params && params.view === 'map',
    headerRight: (
      <RectButton
        style={{ marginRight: 10 }}
        onPress={() => {
          if (params && params.view === 'map') {
            setParams({ view: 'list' });
          } else {
            setParams({ view: 'map' });
          }
        }}
      >
        <Text style={{ padding: 8 }}>{params && params.view === 'map' ? 'List' : 'Map'}</Text>
      </RectButton>
    ),
  });

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
    const {
      navigation: { navigate },
    } = this.props;
    return (
      <RectButton onPress={() => navigate('BusinessDetails', { businessDetails: item })}>
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

  _onSearchAgain = () => {
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'Main' })],
    });
    this.props.navigation.dispatch(resetAction);
  };

  render() {
    const {
      businesses: { businesses },
      loading,
      navigation: {
        state: { params },
      },
    } = this.props;

    if (!loading && businesses && businesses.length <= 0) {
      return <NoResult onSearchAgain={this._onSearchAgain} />;
    }

    if (params && params.view === 'map' && businesses.length > 0) {
      return <MapView businesses={businesses} />;
    }

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
