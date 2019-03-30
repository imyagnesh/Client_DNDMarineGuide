import { all } from 'redux-saga/effects';
import cities from './citiesSaga';
import marinas from './marinasSaga';
import categories from './categoriesSaga';
import businesses from './businessesSaga';
import advertisement from './advertisementSaga';

export default function* rootSaga() {
  yield all([cities(), marinas(), categories(), businesses(), advertisement()]);
}
