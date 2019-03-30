import { call, put, takeEvery, all } from 'redux-saga/effects';
import { Api, action, edition } from 'utils';
import Config from 'react-native-config';
import * as types from '../constants/actionTypes';

function* getBadges({ payload }) {
  const queryString = Object.keys(payload)
    .map(key => `${key}=${payload[key]}`)
    .join('&');
  const url = `${Config.API_URL}/marinas?edition=${edition}${queryString ? `&${queryString}` : ''}`;
  try {
    const res = yield call(Api, url, 'GET');
    yield put(action(`${types.FETCH_MARINAS}_${types.SUCCESS}`, res));
  } catch (error) {
    yield put(action(`${types.FETCH_MARINAS}_${types.FAILURE}`, error));
  }
}

function* get() {
  yield takeEvery(`${types.FETCH_MARINAS}_${types.REQUEST}`, getBadges);
}

export default function* init() {
  yield all([get()]);
}
