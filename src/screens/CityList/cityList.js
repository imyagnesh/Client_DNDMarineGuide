import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, ActivityIndicator } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import MultiSelect from '../../components/MultiSelect';

export default class index extends Component {
  static propTypes = {
    fetchCities: PropTypes.func.isRequired,
    cities: PropTypes.array.isRequired,
    navigation: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
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
        navigation: {
          setParams,
          navigate,
          state: { params },
        },
      } = this.props;

      const { search } = params;

      setParams({
        onNextPress: () =>
          navigate('BusinessList', {
            search: { ...search, cities: data.map(x => x.bus_city).toString() },
          }),
      });
    }
  };

  render() {
    const { cities } = this.state;
    const { loading } = this.props;
    return (
      <MultiSelect
        data={cities}
        renderItem={this._renderItem}
        onSelectData={this._onSelectData}
        uniqueKey="bus_city"
        searchKey="bus_city"
        loading={loading}
      />
    );
  }
}
