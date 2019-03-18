import { PixelRatio, Platform } from 'react-native';

export const ls = val => PixelRatio.getPixelSizeForLayoutSize(val);
export const os = Platform.OS;

export const apiUrl = 'http://localhost:9890/api';
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
