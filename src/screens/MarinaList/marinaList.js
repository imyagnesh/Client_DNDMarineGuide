import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { StackActions, NavigationActions } from 'react-navigation';
import MultiSelect from '../../components/MultiSelect';

export default class index extends PureComponent {
  static propTypes = {
    fetchMarinas: PropTypes.func.isRequired,
    marinas: PropTypes.array.isRequired,
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
          if (params && params.onNextPress) {
            params.onNextPress();
          } else {
            alert('please select data');
          }
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
    marinas: [],
  };

  constructor(props) {
    super(props);
    const {
      navigation: {
        state: { params },
      },
      fetchMarinas,
    } = props;
    const { search } = params;
    fetchMarinas(search);
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
        navigation: {
          setParams,
          navigate,
          state: { params },
        },
      } = this.props;

      const { search } = params;

      setParams({
        onNextPress: () =>
          navigate('Categories', {
            search: { ...search, marinas: data.map(x => x.marina_cd).toString() },
          }),
      });
    }
  };

  render() {
    const { marinas } = this.state;
    const { loading } = this.props;
    return (
      <MultiSelect
        data={marinas}
        renderItem={this._renderItem}
        onSelectData={this._onSelectData}
        uniqueKey="marina_cd"
        searchKey="mar_name"
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
