import {
  querySysConfigs,
  saveSysConfig,
  updateSysConfig,
  deleteSysConfig,
} from '../services/sysConfig';

export default {
  namespace: 'sysConfig',

  state: {
    page: {},
    lastQuery: {},
  },

  effects: {
    *fetch({ params }, { call, put }) {
      const response = yield call(querySysConfigs, params);
      yield put({
        type: 'save',
        response,
        query: params,
      });
    },
    *saveConfig({ payload }, { call }) {
      const response = yield call(saveSysConfig, payload);
      return response;
    },
    *updateConfig({ payload }, { call }) {
      const response = yield call(updateSysConfig, payload);
      return response;
    },
    *deleteConfig({ payload }, { call }) {
      const response = yield call(deleteSysConfig, payload);
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
