export default (state = {}, action) => {
  const { type, payload } = action;
  const matches = /(.*)_(REQUEST|FAILURE)/.exec(type);

  // not a *_REQUEST / *_FAILURE actions, so we ignore them
  if (!matches) return state;

  const [, requestName, requestState] = matches;

  if (requestState === 'FAILURE') {
    return {
      ...state,
      [requestName]: payload,
    };
  }
  const { [requestName]: data, ...rest } = state;
  return rest;
};
