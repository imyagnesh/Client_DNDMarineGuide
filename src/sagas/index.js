import { all } from 'redux-saga/effects';
import cities from './citiesSaga';
import marinas from './marinasSaga';
import categories from './categoriesSaga';

export default function* rootSaga() {
  yield all([cities(), marinas(), categories()]);
}
