import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Text, View, Image } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import { RectButton } from 'react-native-gesture-handler';
import MultiSelect from '../../components/MultiSelect';

export default class index extends PureComponent {
  static propTypes = {
    fetchCategories: PropTypes.func.isRequired,
    categories: PropTypes.array.isRequired,
    navigation: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    advertisement: PropTypes.object.isRequired,
    getAdvertisement: PropTypes.func.isRequired,
    clearAdvertisement: PropTypes.func.isRequired,
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
        state: { params, routeName },
        addListener,
      },
      clearAdvertisement,
      getAdvertisement,
    } = this.props;

    const { search } = params;
    const hasCities = search.hasOwnProperty('cities');
    const hasMarinas = search.hasOwnProperty('marinas');
    setParams({
      onNextPress: () =>
        navigate(hasCities || hasMarinas ? 'BusinessList' : 'Cities', {
          search: { ...search, category: '' },
          routeName,
        }),
    });
    this.focusSubscription = addListener('willFocus', () => {
      clearAdvertisement();
      getAdvertisement(3);
    });
  }

  componentWillReceiveProps = nextProps => {
    this.setState({
      categories: nextProps.categories,
    });
  };

  componentWillUnmount() {
    this.focusSubscription.remove();
  }

  _renderItem = item => {
    return <Text style={{ paddingHorizontal: 10 }}>{item.bus_cat_cd_desc}</Text>;
  };

  _onSelectData = data => {
    if (data) {
      const {
        navigation: {
          setParams,
          navigate,
          state: { params, routeName },
        },
      } = this.props;

      const { search } = params;

      const newSearch = { ...search, category: data.map(x => x.bus_cat_cd).toString() };

      const hasCities = search.hasOwnProperty('cities');
      const hasMarinas = search.hasOwnProperty('marinas');

      setParams({
        onNextPress: () =>
          navigate(hasCities || hasMarinas ? 'BusinessList' : 'Cities', {
            search: newSearch,
            routeName,
          }),
      });
    }
  };

  render() {
    const { categories } = this.state;
    const { loading, advertisement } = this.props;
    return (
      <View style={{ flex: 1 }}>
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
        {advertisement && (
          <View style={{ height: 50, flexDirection: 'row' }}>
            <Image
              source={{ uri: advertisement.ad_url }}
              resizeMode="cover"
              style={{ height: 50, flex: 1, width: null }}
            />
          </View>
        )}
      </View>
    );
  }
}
