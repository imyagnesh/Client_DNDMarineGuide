import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Text, View, Image, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { StackActions, NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { formatPhoneNumber, openLink } from 'utils';
import MultiSelect from '../../components/MultiSelect';

export default class index extends PureComponent {
  static propTypes = {
    fetchMarinas: PropTypes.func.isRequired,
    marinas: PropTypes.array.isRequired,
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
    marinas: [],
    showModal: false,
    selectedItem: null,
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

  componentDidMount() {
    const {
      navigation: {
        setParams,
        navigate,
        state: { params },
        addListener,
      },
      clearAdvertisement,
      getAdvertisement,
    } = this.props;

    const { search } = params;

    setParams({
      onNextPress: () =>
        navigate('Categories', {
          search: { ...search, marinas: '' },
        }),
    });
    this.focusSubscription = addListener('willFocus', () => {
      clearAdvertisement();
      getAdvertisement(3);
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      marinas: nextProps.marinas,
    });
  }

  _renderItem = item => {
    return <Text style={{ paddingHorizontal: 10 }}>{item.mar_name}</Text>;
  };

  onInfoPress = item => {
    this.setState({ selectedItem: item, showModal: true });
  };

  _onSelectData = data => {
    if (data) {
      const {
        navigation: {
          setParams,
          navigate,
          state: { params },
        },
      } = this.props;

      const { search } = params;

      const newSearch = { ...search, marinas: data.map(x => x.marina_cd).toString() };

      setParams({
        onNextPress: () =>
          navigate('Categories', {
            search: newSearch,
          }),
      });
    }
  };

  render() {
    const { marinas, showModal, selectedItem } = this.state;
    const { loading, advertisement } = this.props;
    return (
      <View style={{ flex: 1 }}>
        {selectedItem && (
          <Modal visible={showModal} transparent animationType="slide">
            <View
              style={{
                ...StyleSheet.absoluteFill,
                backgroundColor: 'rgba(0,0,0, 0.4)',
                justifyContent: 'center',
              }}
            >
              <View
                style={{
                  backgroundColor: '#fff',
                  marginHorizontal: 30,
                  borderRadius: 10,
                }}
              >
                <TouchableOpacity
                  style={{ flexDirection: 'row' }}
                  onPress={() => openLink(`tel:${selectedItem.mar_phone}`)}
                >
                  <View
                    style={{ flex: 1, flexDirection: 'row', padding: 10, alignItems: 'center' }}
                  >
                    <Icon name="place" size={24} color="#000" />
                    <Text style={{ flexDirection: 'row', flexWrap: 'wrap', padding: 10 }}>
                      {`${selectedItem.mar_add || ''}
${selectedItem.mar_city || ''} ${selectedItem.mar_st || ''} ${selectedItem.mar_zip ||
                        ''} ${selectedItem.mar_co || ''}`}
                    </Text>
                  </View>
                </TouchableOpacity>

                {!!selectedItem.mar_phone && (
                  <TouchableOpacity
                    style={{ flexDirection: 'row' }}
                    onPress={() => openLink(`tel:${selectedItem.mar_phone}`)}
                  >
                    <View
                      style={{ flex: 1, flexDirection: 'row', padding: 10, alignItems: 'center' }}
                    >
                      <Icon name="phone" size={24} color="#000" />
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: '400',
                          lineHeight: 24,
                          paddingHorizontal: 10,
                        }}
                        numberOfLines={1}
                        allowFontScaling={false}
                      >
                        {formatPhoneNumber(selectedItem.mar_phone)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
                {!!selectedItem.mar_website && (
                  <TouchableOpacity
                    style={{ flexDirection: 'row' }}
                    onPress={() => openLink(selectedItem.mar_website)}
                  >
                    <View
                      style={{ flex: 1, flexDirection: 'row', padding: 10, alignItems: 'center' }}
                    >
                      <Icon name="explore" size={24} color="#000" />
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: '400',
                          lineHeight: 24,
                          paddingHorizontal: 10,
                        }}
                        numberOfLines={1}
                        allowFontScaling={false}
                      >
                        {selectedItem.mar_website}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={{
                    width: 100,
                    height: 40,
                    margin: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                  }}
                  onPress={() => {
                    this.setState({ selectedItem: null, showModal: false });
                  }}
                >
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: 18,
                      fontWeight: 'bold',
                      color: '#5DAFDE',
                    }}
                  >
                    Done
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}
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
          onInfoPress={this.onInfoPress}
          info
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
