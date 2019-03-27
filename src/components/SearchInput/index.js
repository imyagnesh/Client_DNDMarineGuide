import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, TextInput, StyleSheet } from 'react-native';
import { BorderlessButton } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default class index extends PureComponent {
  static propTypes = {
    onChangeText: PropTypes.func.isRequired,
  };

  state = {
    search: '',
  };

  render() {
    const { search } = this.state;
    const { onChangeText } = this.props;
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
          placeholder="Type Here..."
          underlineColorAndroid="transparent"
          style={{
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: '#4A4A4A',
            height: 30,
            borderRadius: 4,
            paddingLeft: 30,
            paddingRight: 30,
            paddingVertical: 0,
          }}
          returnKeyType="done"
          onChangeText={text => {
            this.setState({ search: text }, () => {
              onChangeText(text);
            });
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
                onChangeText('');
                this.searchInput.clear();
              });
            }}
          >
            <Icon name="close" size={18} color="#4A4A4A" />
          </BorderlessButton>
        )}
      </View>
    );
  }
}
