import { querySysTokens, forceLogout } from '../services/sysTokenService';

export default {
  namespace: 'sysToken',

  state: {
    page: {},
    lastQuery: {},
  },

  effects: {
    *fetch({ params }, { call, put }) {
      const response = yield call(querySysTokens, params);
      yield put({
        type: 'save',
        response,
        query: params,
      });
    },
    *remove({ token }, { call }) {
      const response = yield call(forceLogout, token);
      return response;
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        page: action.response.page,
        lastQuery: action.query,
      };
    },
  },
};
