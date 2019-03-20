import * as types from '../constants/actionTypes';

const initialState = [];

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case `${types.FETCH_BUSINESSES}_${types.SUCCESS}`:
      return [...state, ...payload];

    case types.CLEAR_BUSINESSES:
      return initialState;

    default:
      return state;
  }
};
