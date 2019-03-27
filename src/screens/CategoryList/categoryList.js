import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
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
        onPress={() => {
          params.onNextPress();
        }}
      >
        <Text
          style={{ padding: 10, color: '#fff', fontSize: 17 }}
          numberOfLines={1}
          allowFontScaling={false}
          accessible={false}
        >
          Next
        </Text>
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

  componentDidMount() {
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
          search,
        }),
    });
  }

  componentWillReceiveProps = nextProps => {
    this.setState({
      categories: nextProps.categories,
    });
  };

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

      let newSearch = search;
      if (data.length > 0) {
        newSearch = { ...search, cities: data.map(x => x.bus_cat_cd).toString() };
      }

      setParams({
        onNextPress: () =>
          navigate('BusinessList', {
            search: newSearch,
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
        onSearchAgain={() => {
          const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'Main' })],
          });
          this.props.navigation.dispatch(resetAction);
        }}
      />
    );
  }
}
