import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-native';
import MultiSelect from '../../components/MultiSelect';

export default class index extends Component {
  static propTypes = {
    fetchCities: PropTypes.func.isRequired,
    cities: PropTypes.array.isRequired,
  };

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

  render() {
    const { cities } = this.state;
    return (
      <MultiSelect
        data={cities}
        renderItem={this._renderItem}
        uniqueKey="bus_city"
        searchKey="bus_city"
      />
    );
  }
}
