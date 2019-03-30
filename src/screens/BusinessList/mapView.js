import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, Dimensions, StyleSheet } from 'react-native';
import Supercluster from 'supercluster';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import BusinessListItem from './businessListItem';

import MapClusterMarker from './MapClusterMarker';
import DetailView from './detailAnimation';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 48.757569;
const LONGITUDE = -122.502871;
const LATITUDE_DELTA = 0.0457;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

class mapView extends PureComponent {
  static propTypes = {
    businesses: PropTypes.array.isRequired,
    openDetails: PropTypes.func.isRequired,
    currentLocation: PropTypes.object.isRequired,
  };

  state = {
    region: {
      latitude: LATITUDE,
      longitude: LONGITUDE,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    },
    visible: false,
    business: null,
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
              const zoomLevel = 90 / 100.0000000001;
              const Lat = LATITUDE_DELTA - LATITUDE_DELTA * zoomLevel;
              const Lng = LONGITUDE_DELTA - LONGITUDE_DELTA * zoomLevel;
              if (marker.properties) {
                if (marker.properties.cluster) {
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
                } else if (marker.properties.id) {
                  const business = this.props.businesses.find(
                    x => x.bus_cd === marker.properties.id,
                  );
                  if (business) {
                    this.map.animateToRegion(
                      {
                        latitude: business.bus_latitude,
                        longitude: business.bus_longitude,
                        latitudeDelta: Lat,
                        longitudeDelta: Lng,
                      },
                      300,
                    );
                    this.setState({ business, visible: true });
                  }
                  // this.props.openDetails(marker.properties.id);
                }
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
    const { visible, business } = this.state;
    const { openDetails, currentLocation } = this.props;
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
        <DetailView
          visible={visible}
          onClose={() => this.setState({ visible: false, business: null })}
        >
          {business && (
            <BusinessListItem
              item={business}
              currentLocation={currentLocation}
              onPress={distance => {
                openDetails(business, distance);
                this.setState({ visible: false, business: null });
              }}
              isMap
            />
          )}
        </DetailView>
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
