import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import MultiSelect from '../../components/MultiSelect';

export default class index extends Component {
  static propTypes = {
    fetchMarinas: PropTypes.func.isRequired,
    marinas: PropTypes.array.isRequired,
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

  _onSelectData = data => {
    if (data && data.length > 0) {
      const {
        navigation: { setParams, navigate },
      } = this.props;

      setParams({
        onNextPress: () => navigate('CitySearch', { selectedMarinas: data.map(x => x.marina_cd) }),
      });
    }
  };

  render() {
    const { marinas } = this.state;
    return (
      <MultiSelect
        data={marinas}
        renderItem={this._renderItem}
        onSelectData={this._onSelectData}
        uniqueKey="marina_cd"
        searchKey="mar_name"
      />
    );
  }
}
