import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Text } from 'react-native-svg';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default class MapClusterMarker extends PureComponent {
  render() {
    const { circleColour, textColour } = this.props;

    if (
      !this.props.hasOwnProperty('properties') ||
      !this.props.properties.hasOwnProperty('cluster') ||
      !this.props.properties.cluster
    ) {
      return <Icon name="place" size={32} color={circleColour} />;
    }

    const pointCount = this.props.properties.point_count_abbreviated;
    const height = 30;
    const width = 30;
    const fontSize = 15;

    return (
      <View>
        <Svg height={height} width={width}>
          <Circle
            cx={width / 2}
            cy={height / 2}
            strokeWidth={0}
            r="15"
            fill={circleColour}
            fillOpacity={0.5}
          />
          <Circle cx={width / 2} cy={height / 2} strokeWidth={0} r="11" fill={circleColour} />
          <Text
            fill={textColour}
            fontSize={fontSize}
            // fontWeight="bold"
            strokeWidth={0}
            x={15}
            y={20}
            textAnchor="middle"
          >
            {pointCount}
          </Text>
        </Svg>
      </View>
    );
  }
}

MapClusterMarker.propTypes = {
  circleColour: PropTypes.string,
  textColour: PropTypes.string,
};

MapClusterMarker.defaultProps = {
  circleColour: '#2b87a2',
  textColour: 'white',
};
