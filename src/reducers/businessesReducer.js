import * as types from '../constants/actionTypes';

const initialState = {
  recordsTotal: 0,
  businesses: [],
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case `${types.FETCH_BUSINESSES}_${types.SUCCESS}`:
      return { ...state, businesses: [...state.businesses, ...payload.businesses] };

    case types.CLEAR_BUSINESSES:
      return initialState;

    default:
      return state;
  }
};
