import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Dimensions,
  PermissionsAndroid,
  Platform,
  ToastAndroid,
  StyleSheet,
} from 'react-native';
import Supercluster from 'supercluster';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import MapClusterMarker from './MapClusterMarker';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 48.757569;
const LONGITUDE = -122.502871;
const LATITUDE_DELTA = 0.0457;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

class mapView extends PureComponent {
  static propTypes = {
    businesses: PropTypes.array.isRequired,
  };

  state = {
    region: {
      latitude: LATITUDE,
      longitude: LONGITUDE,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    },
  };

  constructor(props) {
    super(props);
    const { region } = this.state;
    const cluster = this._createCluster(props.businesses);
    const markers = this._getMarkers(cluster, region);
    this.state = { ...this.state, markers, cluster };
  }

  componentWillReceiveProps(nextProps) {
    const { region } = this.state;
    const cluster = this._createCluster(nextProps.businesses);
    const markers = this._getMarkers(cluster, region);

    this.setState({
      cluster,
      markers,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (JSON.stringify(this.state.region) !== JSON.stringify(prevState.region)) {
      const { cluster, region } = this.state;
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        markers: this._getMarkers(cluster, region),
      });
    }
  }

  _convertPoints = data => {
    const places = data
      .filter(x => !!x.bus_longitude && !!x.bus_latitude)
      .map(value => {
        return {
          type: 'Feature',
          properties: {
            id: value.bus_cd,
            name: value.bus_name,
            lat_x: value.bus_latitude,
            long_x: value.bus_longitude,
          },
          geometry: {
            type: 'Point',
            coordinates: [value.bus_longitude, value.bus_latitude],
          },
        };
      });

    return places;
  };

  _createCluster = data => {
    const cluster = new Supercluster({
      radius: 60,
      maxZoom: 16,
    });

    const places = this._convertPoints(data);
    cluster.load(places);
    return cluster;
  };

  _getZoomLevel = (region = this.state.region) => {
    const angle = region.longitudeDelta;
    const level = Math.round(Math.log(360 / angle) / Math.LN2);
    return level;
  };

  _getMarkers = (cluster, region) => {
    const padding = 0;
    return cluster.getClusters(
      [
        region.longitude - region.longitudeDelta * (0.5 + padding),
        region.latitude - region.latitudeDelta * (0.5 + padding),
        region.longitude + region.longitudeDelta * (0.5 + padding),
        region.latitude + region.latitudeDelta * (0.5 + padding),
      ],
      this._getZoomLevel(),
    );
  };

  _hasLocationPermission = async () => {
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

  _getLocation = async () => {
    const _hasLocationPermission = await this._hasLocationPermission();

    if (!_hasLocationPermission) return;

    Geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        this.setState(state => ({
          region: { ...state.region, latitude, longitude },
        }));
      },
      () => {
        ToastAndroid.show('Unable to get Current Position', ToastAndroid.LONG);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000, distanceFilter: 50 },
    );
  };

  _goToRegion = (region, padding) => {
    this.map.fitToCoordinates(region, {
      edgePadding: { top: padding, right: padding, bottom: padding, left: padding },
      animated: true,
    });
  };

  _renderMarkers = () => {
    if (this.state.markers) {
      return this.state.markers.map((marker, i) => {
        return (
          <Marker
            key={i}
            coordinate={{
              latitude: marker.geometry.coordinates[1],
              longitude: marker.geometry.coordinates[0],
            }}
            onPress={() => {
              console.warn(marker);
              const zoomLevel = 80 / 100.0000000001;
              const Lat = LATITUDE_DELTA - LATITUDE_DELTA * zoomLevel;
              const Lng = LONGITUDE_DELTA - LONGITUDE_DELTA * zoomLevel;
              if (Lat >= 0 && Lat <= 180) {
                this.map.animateToRegion(
                  {
                    latitude: marker.geometry.coordinates[1],
                    longitude: marker.geometry.coordinates[0],
                    latitudeDelta: Lat,
                    longitudeDelta: Lng,
                  },
                  300,
                );
              } else {
                console.error(
                  'latitudeDelta Should be In tha range of 1 to 180 or longitudeDelta Should be In tha range of 1 to 360 ',
                );
              }
            }}
          >
            <MapClusterMarker {...marker} />
          </Marker>
        );
      });
    }
    return null;
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          ...StyleSheet.absoluteFillObject,
        }}
      >
        <MapView
          ref={map => {
            this.map = map;
          }}
          style={{
            ...StyleSheet.absoluteFillObject,
          }}
          initialRegion={this.state.region}
          provider={PROVIDER_GOOGLE}
          onRegionChangeComplete={e => this.setState({ region: e })}
          loadingEnabled
          zoomEnabled
          zoomControlEnabled
          scrollEnabled
          showsCompass
          showsScale
        >
          {this._renderMarkers()}
        </MapView>
      </View>
    );
  }
}

export default mapView;

/* <View style={{ backgroundColor: 'red', height: 200 }}>
            <Button
              onPress={() => {
                const newLatitudeDelta =
                  LATITUDE_DELTA - ((height - 100) * LATITUDE_DELTA) / height;
                this.map.animateToRegion(
                  { ...this.state.region, latitude: this.state.region.latitude - newLatitudeDelta },
                  350,
                );
              }}
              title="Click Me"
            />
          </View> */
