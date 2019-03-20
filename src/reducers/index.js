import { combineReducers } from 'redux';
import { createNavigationReducer } from 'react-navigation-redux-helpers';
import Navigator from '../navigation';
import error from './errorReducer';
import loading from './loadingReducer';

import cities from './citiesReducer';
import marinas from './marinasReducer';
import categories from './categoriesReducer';
import businesses from './businessesReducer';

const navReducer = createNavigationReducer(Navigator);

const rootReducer = combineReducers({
  nav: navReducer,
  error,
  loading,
  cities,
  marinas,
  categories,
  businesses,
});

export default rootReducer;
