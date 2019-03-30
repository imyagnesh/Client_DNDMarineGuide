import * as types from '../constants/actionTypes';

const initialState = null;

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case `${types.FETCH_ADVERTISEMENT}_${types.SUCCESS}`: {
      const { length } = payload;
      if (length > 0) {
        const i = Math.floor(Math.random() * length);
        return payload[i];
      }
      return payload[0];
    }

    case types.CLEAR_ADVERTISEMENT:
      return initialState;

    default:
      return state;
  }
};
