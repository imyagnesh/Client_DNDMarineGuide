import { combineReducers } from 'redux';
import { createNavigationReducer } from 'react-navigation-redux-helpers';
import Navigator from '../navigation';

import cities from './citiesReducer';
import marinas from './marinasReducer';
import categories from './categoriesReducer';
import error from './errorReducer';
import loading from './loadingReducer';

const navReducer = createNavigationReducer(Navigator);

const rootReducer = combineReducers({
  nav: navReducer,
  cities,
  marinas,
  categories,
  error,
  loading,
});

export default rootReducer;
