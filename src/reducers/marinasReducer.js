import { FETCH_MARINAS, SUCCESS } from '../constants/actionTypes';

const initialState = [];

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case `${FETCH_MARINAS}_${SUCCESS}`:
      return payload;

    default:
      return state;
  }
};
