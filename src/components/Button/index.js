import React from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { ls } from 'utils';

const index = ({ onPress, value, disabled }) => {
  return (
    <RectButton
      style={{
        flexDirection: 'row',
        height: ls(14),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#5DAFDE',
        borderRadius: 4,
        marginHorizontal: 20,
        marginVertical: 10,
        opacity: disabled ? 0.7 : 1,
      }}
      onPress={() => {
        if (!disabled) onPress();
      }}
    >
      <Text style={{ fontSize: ls(7), color: '#fff' }} allowFontScaling={false}>
        {value}
      </Text>
    </RectButton>
  );
};

index.propTypes = {
  onPress: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
};

index.defaultProps = {
  disabled: false,
};

export default index;
