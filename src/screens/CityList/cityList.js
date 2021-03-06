import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Text, View, Image } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { StackActions, NavigationActions } from 'react-navigation';
import MultiSelect from '../../components/MultiSelect';

export default class index extends PureComponent {
  static propTypes = {
    fetchCities: PropTypes.func.isRequired,
    cities: PropTypes.array.isRequired,
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
    cities: [],
  };

  constructor(props) {
    super(props);
    const {
      navigation: {
        state: { params },
      },
      fetchCities,
    } = props;
    const { search } = params;
    fetchCities(search);
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

    console.warn('search', search);

    const hasCategory = search.hasOwnProperty('category');
    const isDine = search.service === 'Dine';
    setParams({
      onNextPress: () =>
        navigate(hasCategory || isDine ? 'BusinessList' : 'Categories', {
          search: { ...search, cities: '' },
          routeName,
        }),
    });
    this.focusSubscription = addListener('willFocus', () => {
      clearAdvertisement();
      getAdvertisement(3);
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      cities: nextProps.cities,
    });
  }

  componentWillUnmount() {
    this.focusSubscription.remove();
  }

  _renderItem = item => {
    return <Text style={{ paddingHorizontal: 10 }}>{item.bus_city}</Text>;
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

      const newSearch = { ...search, cities: data.map(x => x.bus_city).toString() };

      const hasCategory = search.hasOwnProperty('category');
      const isDine = search.service === 'Dine';

      setParams({
        onNextPress: () =>
          navigate(hasCategory || isDine ? 'BusinessList' : 'Categories', {
            search: newSearch,
            routeName,
          }),
      });
    }
  };

  render() {
    const { cities } = this.state;
    const { loading, advertisement } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <MultiSelect
          data={cities}
          renderItem={this._renderItem}
          onSelectData={this._onSelectData}
          uniqueKey="bus_city"
          searchKey="bus_city"
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
