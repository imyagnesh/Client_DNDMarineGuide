import { call, put, takeEvery, all } from 'redux-saga/effects';
import { Api, action } from 'utils';
import Config from 'react-native-config';
import * as types from '../constants/actionTypes';

function* getAdvertisement({ payload }) {
  const url = `${Config.API_URL}/getAdvertisements?addType=${payload}`;
  try {
    const res = yield call(Api, url, 'GET');
    yield put(action(`${types.FETCH_ADVERTISEMENT}_${types.SUCCESS}`, res));
  } catch (error) {
    yield put(action(`${types.FETCH_ADVERTISEMENT}_${types.FAILURE}`, error));
  }
}

function* get() {
  yield takeEvery(`${types.FETCH_ADVERTISEMENT}_${types.REQUEST}`, getAdvertisement);
}

export default function* init() {
  yield all([get()]);
}
