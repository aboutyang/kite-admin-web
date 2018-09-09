import {
  querySysCacheName,
  querySysCaches,
  deleteSysCache,
  queryCacheInfo,
} from '../services/sysCacheService';

export default {
  namespace: 'sysCache',

  state: {
    cacheNames: [],
    lastQuery: {},
  },

  effects: {
    *type(_, { call, put }) {
      const response = yield call(querySysCacheName);
      yield put({
        type: 'saveType',
        response,
      });
    },
    *fetch({ params }, { call, put }) {
      const response = yield call(querySysCaches, params);
      yield put({
        type: 'save',
        response,
        query: params,
      });
    },
    *remove({ payload }, { call }) {
      const response = yield call(deleteSysCache, payload);
      return response;
    },
    *info({ payload }, { call, put }) {
      const response = yield call(queryCacheInfo, payload);
      yield put({
        type: 'saveInfo',
        response,
      });
    },
    *reset(_, { put }) {
      yield put({
        type: 'init',
      });
    },
  },

  reducers: {
    saveType(state, action) {
      return {
        ...state,
        cacheNames: action.response.cacheNames,
      };
    },
    save(state, action) {
      return {
        ...state,
        cacheList: action.response.cacheList,
        lastQuery: action.query,
      };
    },
    saveInfo(state, action) {
      return {
        ...state,
        cacheInfo: action.response.cacheInfo,
      };
    },
    init(state) {
      return {
        ...state,
        lastQuery: {},
        cacheInfo: undefined,
        cacheList: undefined,
      };
    },
  },
};
