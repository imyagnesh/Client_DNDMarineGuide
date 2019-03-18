import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-native';
import MultiSelect from '../../components/MultiSelect';

export default class index extends Component {
  static propTypes = {
    fetchMarinas: PropTypes.func.isRequired,
    marinas: PropTypes.array.isRequired,
  };

  state = {
    marinas: [],
  };

  constructor(props) {
    super(props);
    props.fetchMarinas();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      marinas: nextProps.marinas,
    });
  }

  _renderItem = item => {
    return <Text style={{ paddingHorizontal: 10 }}>{item.mar_name}</Text>;
  };

  render() {
    const { marinas } = this.state;
    return (
      <MultiSelect
        data={marinas}
        renderItem={this._renderItem}
        uniqueKey="marina_cd"
        searchKey="mar_name"
      />
    );
  }
}
