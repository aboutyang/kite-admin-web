import { querySyLogs } from '../services/sysLog';

export default {
  namespace: 'sysLog',

  state: {
    page: {},
    lastQuery: {},
  },

  effects: {
    *fetch({ params }, { call, put }) {
      const response = yield call(querySyLogs, params);
      yield put({
        type: 'save',
        response,
        query: params,
      });
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
