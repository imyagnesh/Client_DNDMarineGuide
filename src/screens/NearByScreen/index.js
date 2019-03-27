import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
  ActivityIndicator,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { StackActions, NavigationActions } from 'react-navigation';
import Error from '../../components/Error';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  result: {
    borderWidth: 1,
    borderColor: '#666',
    width: '100%',
    paddingHorizontal: 16,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 12,
    width: '100%',
  },
});

export default class App extends Component<{}> {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
  };

  state = {
    loading: false,
    city: '',
    error: false,
  };

  componentDidMount() {
    this.getLocation();
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

  getLocation = async () => {
    const hasLocationPermission = await this.hasLocationPermission();

    if (!hasLocationPermission) return;

    this.setState({ loading: true }, () => {
      Geolocation.getCurrentPosition(
        async position => {
          const {
            coords: { latitude, longitude },
          } = position;
          try {
            const city = await this.getCityDetails(latitude, longitude);
            this.setState({ error: '', city, loading: false });
          } catch (error) {
            this.setState({ error, city: '', loading: false });
          }
        },
        error => {
          this.setState({ city: '', error, loading: false });
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000, distanceFilter: 50 },
      );
    });
  };

  getCityDetails = (latitude, longitude) => {
    return new Promise((resolve, reject) => {
      fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&sensor=false&key=AIzaSyBpQb8H-ziLM-s8K9A0UuVxaBO08DANUG0`,
      )
        .then(response => response.json())
        .then(responseJson => {
          if (responseJson.results) {
            let city = '';
            responseJson.results.forEach(addressComponent => {
              if (addressComponent.types[0] === 'locality') {
                city = addressComponent.address_components[0].long_name;
              }
            });
            resolve(city);
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  };

  _onSearchAgain = () => {
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'Main' })],
    });
    this.props.navigation.dispatch(resetAction);
  };

  _onContinueSearch = () => {
    const {
      navigation: {
        navigate,
        state: { params },
      },
    } = this.props;
    const { city } = this.state;

    const { search } = params;

    navigate(search.service === 'Dock' ? 'BusinessList' : 'Categories', {
      search: { ...search, cities: [city].toString() },
    });
  };

  render() {
    const { city, error, loading } = this.state;
    if (loading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" animating />
        </View>
      );
    }
    if (error) {
      return (
        <Error
          title="Internal Error"
          text="Oops! Something went wrong Try Again"
          buttonText="Try Again"
          onRetry={this._onSearchAgain}
        />
      );
    }
    return (
      <Error
        title="Your Current Location"
        text={city}
        buttonText="Next"
        onRetry={this._onContinueSearch}
      />
    );
  }
}
