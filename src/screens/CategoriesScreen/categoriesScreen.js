import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-native';
import MultiSelect from '../../components/MultiSelect';

export default class index extends Component {
  static propTypes = {
    fetchCategories: PropTypes.func.isRequired,
    categories: PropTypes.array.isRequired,
  };

  state = {
    categories: [],
  };

  constructor(props) {
    super(props);
    props.fetchCategories();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      categories: nextProps.categories,
    });
  }

  _renderItem = item => {
    return <Text style={{ paddingHorizontal: 10 }}>{item.bus_cat_cd_desc}</Text>;
  };

  render() {
    const { categories } = this.state;
    return (
      <MultiSelect
        data={categories}
        renderItem={this._renderItem}
        uniqueKey="bus_cat_cd"
        searchKey="bus_cat_cd_desc"
      />
    );
  }
}
