import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  PermissionsAndroid,
  ToastAndroid,
  Platform,
} from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import { RectButton } from 'react-native-gesture-handler';
import { os } from 'utils';

import Geolocation from 'react-native-geolocation-service';
import MapView from './mapView';
import Error from '../../components/Error';
import BusinessListItem from './businessListItem';

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
    currentLocation: null,
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
    this.getLocation();
  }

  _renderItem = ({ item }) => {
    const {
      navigation: { navigate },
    } = this.props;
    const { currentLocation } = this.state;
    return (
      <BusinessListItem
        item={item}
        currentLocation={currentLocation}
        onPress={distance => navigate('BusinessDetails', { businessDetails: item, distance })}
      />
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

  hasLocationPermission = async () => {
    if (os === 'ios' || (os === 'android' && Platform.Version < 23)) {
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
          try {
            const {
              coords: { latitude, longitude },
            } = position;
            this.setState({
              currentLocation: {
                latitude,
                longitude,
              },
              error: false,
              loading: false,
            });
          } catch (error) {
            this.setState({ error, loading: false });
          }
        },
        error => {
          this.setState({ error, loading: false });
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000, distanceFilter: 50 },
      );
    });
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
      loading: businessesLoading,
      navigation: {
        navigate,
        state: { params },
      },
    } = this.props;

    const { currentLocation, error, loading: locationLoading } = this.state;

    const loading = businessesLoading || locationLoading;

    console.log(error);

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
          currentLocation={currentLocation}
          openDetails={(item, distance) =>
            navigate('BusinessDetails', { businessDetails: item, distance })
          }
        />
      );
    }

    return (
      <View style={{ flex: 1 }}>
        <FlatList
          data={businesses}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
          ListFooterComponent={this._renderFooter}
          refreshing={loading}
          extraData={this.state}
          onEndReached={this._loadMore}
          onEndReachedThreshold={100}
          ItemSeparatorComponent={this._itemSeparator}
        />
        <View style={{ height: 50, flexDirection: 'row', backgroundColor: 'red' }} />
      </View>
    );
  }
}
