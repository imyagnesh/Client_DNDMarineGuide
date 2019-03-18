import * as types from '../constants/actionTypes';

const initialState = [];

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case `${types.FETCH_CATEGORIES}_${types.SUCCESS}`:
      return payload;

    default:
      return state;
  }
};
