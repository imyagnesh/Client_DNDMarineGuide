import { PixelRatio, Platform, Dimensions, Linking, Alert } from 'react-native';

export const ls = val => PixelRatio.getPixelSizeForLayoutSize(val);
export const os = Platform.OS;

export const { width: WIDTH, height: HEIGHT } = Dimensions.get('window');

export const apiUrl = os === 'ios' ? 'http://127.0.0.1:9890/api' : 'http://10.0.2.2:9890/api';
export const edition = 'PNW';

export const Api = (url, method, headers = {}, body = '') =>
  new Promise(async (resolve, reject) => {
    let options = {
      method,
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        ...headers,
      },
    };
    if (body) {
      options = { ...options, body };
    }
    try {
      const response = await fetch(url, options);
      const json = await response.json();

      if (json.status) {
        if (json.status.toUpperCase() === 'ERROR') {
          reject(json.reason);
        } else {
          resolve(json.response);
        }
      } else {
        resolve(json);
      }
    } catch (error) {
      reject(error);
    }
  });

export const action = (type, payload, meta = null) => ({
  type,
  payload,
  meta,
});

export const formatPhoneNumber = phoneNumberString => {
  const cleaned = `${phoneNumberString}`.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }
  return '';
};

export const openLink = url => {
  Linking.canOpenURL(url)
    .then(supported => {
      if (!supported) {
        Alert.alert('Error', 'Url Not supported');
      } else {
        Linking.openURL(url);
      }
    })
    .catch(() => {
      Alert.alert('Error', 'Unable to open Url');
    });
};
