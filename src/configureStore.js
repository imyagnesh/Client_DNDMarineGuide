import { createStore, applyMiddleware, compose } from 'redux';
import logger from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import appReducer from './reducers';
import rootSaga from './sagas';

const sagaMiddleware = createSagaMiddleware();
let middleware = [sagaMiddleware];

let composeEnhancers = compose;

if (__DEV__) {
  composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  middleware = [...middleware, logger];
} else {
  middleware = [...middleware];
}

export default function configureStore(NavigationReduxMiddleware) {
  const store = createStore(
    appReducer,
    composeEnhancers(applyMiddleware(...middleware, NavigationReduxMiddleware)),
  );

  sagaMiddleware.run(rootSaga);
  return store;
}
