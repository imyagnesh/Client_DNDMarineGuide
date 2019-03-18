import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, FlatList, TextInput, StyleSheet } from 'react-native';
import { RectButton, BorderlessButton } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default class index extends PureComponent {
  static propTypes = {
    data: PropTypes.array.isRequired,
    renderItem: PropTypes.func.isRequired,
    searchKey: PropTypes.string.isRequired,
    uniqueKey: PropTypes.any.isRequired,
    onSelectData: PropTypes.func.isRequired,
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
    const { uniqueKey } = this.props;
    return (
      <RectButton key={`${item[uniqueKey]}`} onPress={() => this.selectItem(item)}>
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
    const { search } = this.state;
    return (
      <View style={{ padding: 10 }}>
        <Icon
          style={{
            position: 'absolute',
            top: 10 + (30 - 18) / 2,
            left: 15,
            height: 18,
            width: 18,
          }}
          name="search"
          size={18}
          color="#4A4A4A"
        />
        <TextInput
          ref={ref => {
            this.searchInput = ref;
          }}
          autoComplete="off"
          placeholder="Type Here..."
          underlineColorAndroid="transparent"
          style={{
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: '#4A4A4A',
            height: 30,
            borderRadius: 4,
            paddingLeft: 30,
            paddingRight: 30,
          }}
          returnKeyType="done"
          onChangeText={text => {
            this.setState({ search: text });
          }}
        />
        {!!search && (
          <BorderlessButton
            style={{
              position: 'absolute',
              top: 10 + (30 - 18) / 2,
              right: 15,
              height: 18,
              width: 18,
            }}
            onPress={() => {
              this.setState({ search: '' }, () => {
                this.searchInput.clear();
              });
            }}
          >
            <Icon name="close" size={18} color="#4A4A4A" />
          </BorderlessButton>
        )}
      </View>
    );
  };

  render() {
    const { data, search } = this.state;
    const { searchKey } = this.props;

    const filteredCities = data.filter(x => x[searchKey].includes(search));
    return (
      <FlatList
        data={filteredCities}
        ListHeaderComponent={this.renderHeader}
        renderItem={this.renderItem}
        keyExtractor={this.keyExtractor}
      />
    );
  }
}
