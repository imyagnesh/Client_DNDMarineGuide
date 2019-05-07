import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, FlatList, ActivityIndicator } from 'react-native';
import { RectButton, BorderlessButton } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Error from '../Error';
import SearchInput from '../SearchInput';

export default class index extends PureComponent {
  static propTypes = {
    data: PropTypes.array.isRequired,
    renderItem: PropTypes.func.isRequired,
    searchKey: PropTypes.string.isRequired,
    uniqueKey: PropTypes.any.isRequired,
    onSelectData: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    info: PropTypes.bool,
    onSearchAgain: PropTypes.func.isRequired,
    onInfoPress: PropTypes.func,
  };

  static defaultProps = {
    loading: false,
    info: false,
    onInfoPress: () => {},
  };

  state = {
    data: [],
    search: '',
  };

  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(nextProps.data) !== JSON.stringify(this.props.data)) {
      this.setState({
        data: nextProps.data,
      });
    }
  }

  selectItem = item => {
    try {
      const { data } = this.state;
      const { uniqueKey } = this.props;

      const i = data.findIndex(x => x[uniqueKey] === item[uniqueKey]);

      this.setState(
        {
          data: [
            ...data.slice(0, i),
            { ...data[i], selected: !data[i].selected },
            ...data.slice(i + 1),
          ],
        },
        () => {
          const { data: updatedData } = this.state;
          const selected = updatedData.filter(x => x.selected && x.selected === true);
          this.props.onSelectData(selected);
        },
      );
    } catch (error) {
      console.warn('error', error);
    }
  };

  renderItem = ({ item }) => {
    const { info, onInfoPress } = this.props;
    if (info) {
      return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ flex: 1 }}>{this.renderButton(item)}</View>
          {info && (
            <BorderlessButton
              style={{ paddingHorizontal: 10, alignSelf: 'center' }}
              onPress={() => onInfoPress(item)}
            >
              <Icon name="info" size={24} color="#000" />
            </BorderlessButton>
          )}
        </View>
      );
    }
    return this.renderButton(item);
  };

  renderButton = item => {
    const { uniqueKey } = this.props;
    return (
      <RectButton
        style={{ flex: 1 }}
        key={`${item[uniqueKey]}`}
        onPress={() => this.selectItem(item)}
      >
        <View style={{ flexDirection: 'row', padding: 10, alignItems: 'center' }}>
          <Icon
            name={item.selected ? 'check-box' : 'check-box-outline-blank'}
            size={24}
            color="#000"
          />
          <View style={{ flex: 1 }}>{this.props.renderItem(item)}</View>
        </View>
      </RectButton>
    );
  };

  keyExtractor = item => {
    const { uniqueKey } = this.props;
    return `${item[uniqueKey]}`;
  };

  renderHeader = () => {
    return <SearchInput onChangeText={search => this.setState({ search })} />;
  };

  _renderFooter = () => {
    if (!this.props.loading) return null;

    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 10,
        }}
      >
        <ActivityIndicator animating size="large" />
      </View>
    );
  };

  render() {
    const { data, search } = this.state;
    const { searchKey, loading, onSearchAgain } = this.props;

    if (!loading && data && data.length <= 0) {
      return (
        <Error
          title="Sorry! no Result Found"
          text="Please modify your search criteria and you will find results matching your needs"
          buttonText="Search Again"
          onRetry={onSearchAgain}
        />
      );
    }

    const filteredCities = data.filter(x => x[searchKey].includes(search));
    return (
      <FlatList
        style={{ flex: 1 }}
        data={filteredCities}
        ListHeaderComponent={this.renderHeader}
        renderItem={this.renderItem}
        keyExtractor={this.keyExtractor}
        ListFooterComponent={this._renderFooter}
        refreshing={loading}
      />
    );
  }
}
