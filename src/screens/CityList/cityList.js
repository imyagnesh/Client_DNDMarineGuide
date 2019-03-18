import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import MultiSelect from '../../components/MultiSelect';

export default class index extends Component {
  static propTypes = {
    fetchCities: PropTypes.func.isRequired,
    cities: PropTypes.array.isRequired,
    navigation: PropTypes.object.isRequired,
  };

  static navigationOptions = ({
    navigation: {
      state: { params },
    },
  }) => ({
    headerRight: (
      <RectButton
        style={{ marginRight: 10 }}
        onPress={() => {
          if (params && params.onNextPress) {
            params.onNextPress();
          } else {
            alert('please select data');
          }
        }}
      >
        <Text style={{ padding: 8 }}>Next</Text>
      </RectButton>
    ),
  });

  state = {
    cities: [],
  };

  constructor(props) {
    super(props);
    props.fetchCities();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      cities: nextProps.cities,
    });
  }

  _renderItem = item => {
    return <Text style={{ paddingHorizontal: 10 }}>{item.bus_city}</Text>;
  };

  _onSelectData = data => {
    if (data && data.length > 0) {
      const {
        navigation: { setParams, navigate },
      } = this.props;

      setParams({
        onNextPress: () => navigate('CitySearch', { selectedCities: data.map(x => x.bus_city) }),
      });
    }
  };

  render() {
    const { cities } = this.state;
    return (
      <MultiSelect
        data={cities}
        renderItem={this._renderItem}
        onSelectData={this._onSelectData}
        uniqueKey="bus_city"
        searchKey="bus_city"
      />
    );
  }
}
