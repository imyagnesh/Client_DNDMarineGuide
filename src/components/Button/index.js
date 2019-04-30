import React from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { ls } from 'utils';

const index = ({ onPress, value, disabled, caption }) => {
  return (
    <RectButton
      style={{
        minHeight: ls(14),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#5DAFDE',
        borderRadius: 4,
        marginHorizontal: 20,
        marginVertical: 10,
        opacity: disabled ? 0.7 : 1,
        padding: 10,
      }}
      onPress={() => {
        if (!disabled) onPress();
      }}
    >
      <Text style={{ fontSize: ls(7), color: '#fff' }} allowFontScaling={false}>
        {value}
      </Text>
      {!!caption && (
        <Text
          style={{ fontSize: ls(6), color: '#fff', opacity: 0.9, paddingTop: 6 }}
          allowFontScaling={false}
        >
          {caption}
        </Text>
      )}
    </RectButton>
  );
};

index.propTypes = {
  onPress: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  caption: PropTypes.string,
};

index.defaultProps = {
  disabled: false,
  caption: '',
};

export default index;
