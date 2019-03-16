import React, { PureComponent } from 'react';
import {
  createReduxContainer,
  createReactNavigationReduxMiddleware,
} from 'react-navigation-redux-helpers';

import { Provider } from 'react-redux';
import SplashScreen from 'react-native-splash-screen';

import Navigator from './navigation';
import configureStore from './configureStore';
import ReduxNavigation from './ReduxNavigation';

// Note: createReactNavigationReduxMiddleware must be run before createReduxContainer
const middleware = createReactNavigationReduxMiddleware(state => state.nav);

export const App = createReduxContainer(Navigator);

const store = configureStore(middleware);

export default class Root extends PureComponent {
  state = {};

  componentDidMount() {
    SplashScreen.hide();
  }

  render() {
    return (
      <Provider store={store}>
        <ReduxNavigation />
      </Provider>
    );
  }
}
