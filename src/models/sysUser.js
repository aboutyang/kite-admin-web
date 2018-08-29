import {
  querySysUsers,
  removeSysUser,
  addSysUser,
  updateSysUser,
  generator,
  changeStatus,
} from '../services/sysUser';

export default {
  namespace: 'sysUser',

  state: {
    page: [],
    lastQuery: {},
  },

  effects: {
    *fetch({ params }, { call, put }) {
      const response = yield call(querySysUsers, params);
      yield put({
        type: 'save',
        response,
        query: params,
      });
    },
    *remove({ payload }, { call }) {
      const response = yield call(removeSysUser, payload);
      return response;
    },
    *add({ payload }, { call }) {
      if (payload.isUpdate) {
        const response = yield call(updateSysUser, payload);
        return response;
      } else {
        const response = yield call(addSysUser, payload);
        return response;
      }
    },
    *generator(_, { call }) {
      const response = yield call(generator);
      return response;
    },
    *changeStatus({ userIds, status }, { call }) {
      const response = yield call(changeStatus, userIds, status);
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
