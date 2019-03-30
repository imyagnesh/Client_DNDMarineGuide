import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, ActivityIndicator, FlatList, StyleSheet, Text } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RectButton } from 'react-native-gesture-handler';
import { formatPhoneNumber } from 'utils';
import MapView from './mapView';
import Error from '../../components/Error';

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
    headerRight: (
      <RectButton
        onPress={() => {
          if (params && params.view === 'map') {
            setParams({ view: 'list' });
          } else {
            setParams({ view: 'map' });
          }
        }}
      >
        <Text
          style={{ padding: 10, color: '#fff', fontSize: 17 }}
          numberOfLines={1}
          allowFontScaling={false}
          accessible={false}
        >
          {params && params.view === 'map' ? 'List' : 'Map'}
        </Text>
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
      <RectButton
        style={{ flexDirection: 'row' }}
        onPress={() => navigate('BusinessDetails', { businessDetails: item })}
      >
        <View style={{ flex: 1, flexDirection: 'row', padding: 10, alignItems: 'center' }}>
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
        navigate,
        state: { params },
      },
    } = this.props;

    if (!loading && businesses && businesses.length <= 0) {
      return (
        <Error
          title="Sorry! no Result Found"
          text="Please modify your search criteria and you will find results matching your needs"
          buttonText="Search Again"
          onRetry={this._onSearchAgain}
        />
      );
    }

    if (params && params.view === 'map' && businesses.length > 0) {
      return (
        <MapView
          businesses={businesses}
          openDetails={item => navigate('BusinessDetails', { businessDetails: item })}
        />
      );
    }

    return (
      <FlatList
        data={businesses}
        renderItem={this._renderItem}
        keyExtractor={this._keyExtractor}
        ListFooterComponent={this._renderFooter}
        refreshing={loading}
        onEndReached={this._loadMore}
        onEndReachedThreshold={100}
        ItemSeparatorComponent={this._itemSeparator}
      />
    );
  }
}
