import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import MultiSelect from '../../components/MultiSelect';

export default class index extends PureComponent {
  static propTypes = {
    fetchCategories: PropTypes.func.isRequired,
    categories: PropTypes.array.isRequired,
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
    categories: [],
  };

  constructor(props) {
    super(props);
    const {
      navigation: {
        state: { params },
      },
      fetchCategories,
    } = props;
    const { search } = params;
    fetchCategories(search);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      categories: nextProps.categories,
    });
  }

  _renderItem = item => {
    return <Text style={{ paddingHorizontal: 10 }}>{item.bus_cat_cd_desc}</Text>;
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
            search: { ...search, category: data.map(x => x.bus_cat_cd).toString() },
          }),
      });
    }
  };

  render() {
    const { categories } = this.state;
    const { loading } = this.props;
    return (
      <MultiSelect
        data={categories}
        renderItem={this._renderItem}
        onSelectData={this._onSelectData}
        uniqueKey="bus_cat_cd"
        searchKey="bus_cat_cd_desc"
        loading={loading}
      />
    );
  }
}
